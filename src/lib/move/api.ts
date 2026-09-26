import { createServerFn } from "@tanstack/react-start";
import { getSql, type Sql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  ASSIGNEES,
  PHASES,
  SEED_TASKS,
  isAssignee,
  isPhaseId,
  type BoardState,
  type MutationResult,
  type Task,
  type TaskStatus,
} from "@/lib/move/catalog";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
}

function asBool(value: unknown): boolean {
  return value === true || value === "t" || value === "true" || value === 1;
}

function asStatus(value: unknown): TaskStatus {
  return value === "done" || value === "skipped" ? value : "open";
}

function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function noteText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n/g, "\n").trim().slice(0, 2000);
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

async function viewerName(sql: Sql, userId: string): Promise<string> {
  const rows = await sql<{ name: string | null; email: string | null }>`
    select name, email from "user" where id = ${userId}
  `;
  const name = rows[0]?.name?.trim();
  if (name) return name.slice(0, 80);
  const local = rows[0]?.email?.split("@")[0]?.trim();
  return local || "Family member";
}

async function memberHouseholdId(sql: Sql, userId: string): Promise<string | null> {
  const rows = await sql<{ household_id: string }>`
    select household_id from household_members where user_id = ${userId} limit 1
  `;
  return rows[0]?.household_id ?? null;
}

function mapTask(row: Record<string, unknown>): Task {
  return {
    id: String(row.id),
    title: String(row.title),
    detail: String(row.detail ?? ""),
    note: String(row.note ?? ""),
    noteByName: String(row.noteByName ?? ""),
    phase: String(row.phase),
    assignee: String(row.assignee),
    status: asStatus(row.status),
    pinned: asBool(row.pinned),
    pinOrder: Number(row.pinOrder ?? 0),
    sortOrder: Number(row.sortOrder ?? 0),
    addedByName: String(row.addedByName ?? ""),
  };
}

async function loadBoard(sql: Sql, userId: string): Promise<BoardState> {
  const name = await viewerName(sql, userId);
  const householdId = await memberHouseholdId(sql, userId);
  if (!householdId) return { viewerName: name, household: null, tasks: [] };

  const homes = await sql<{ id: string; name: string; joinCode: string }>`
    select id, name, join_code as "joinCode"
    from households
    where id = ${householdId}
  `;
  const home = homes[0];
  if (!home) return { viewerName: name, household: null, tasks: [] };

  const members = await sql<{ userId: string; displayName: string }>`
    select user_id as "userId", display_name as "displayName"
    from household_members
    where household_id = ${householdId}
    order by joined_at asc
  `;
  const tasks = await sql<Record<string, unknown>>`
    select
      id,
      title,
      detail,
      note,
      note_by_name as "noteByName",
      phase,
      assignee,
      status,
      pinned,
      pin_order as "pinOrder",
      sort_order as "sortOrder",
      added_by_name as "addedByName"
    from tasks
    where household_id = ${householdId}
    order by pinned desc, pin_order asc, sort_order asc, created_at asc
  `;

  return {
    viewerName: name,
    household: {
      id: home.id,
      name: home.name,
      joinCode: home.joinCode,
      members,
    },
    tasks: tasks.map(mapTask),
  };
}

async function insertHousehold(
  sql: Sql,
  userId: string,
  displayName: string,
  listName: string,
  code: string,
): Promise<void> {
  const payload = JSON.stringify(
    SEED_TASKS.map((task, index) => ({
      id: crypto.randomUUID(),
      title: task.title,
      detail: task.detail,
      phase: task.phase,
      assignee: task.assignee,
      pinned: task.pinned,
      pinOrder: task.pinOrder,
      sortOrder: (index + 1) * 10,
    })),
  );
  const id = crypto.randomUUID();
  await sql`
    with h as (
      insert into households (id, name, join_code, created_by)
      values (${id}, ${listName}, ${code}, ${userId})
      returning id
    ),
    m as (
      insert into household_members (household_id, user_id, display_name)
      select h.id, ${userId}, ${displayName} from h
      returning household_id
    )
    insert into tasks (
      id, household_id, title, detail, phase, assignee, pinned, pin_order, sort_order, added_by, added_by_name
    )
    select
      item->>'id',
      h.id,
      item->>'title',
      item->>'detail',
      item->>'phase',
      item->>'assignee',
      coalesce((item->>'pinned')::boolean, false),
      coalesce((item->>'pinOrder')::int, 0),
      coalesce((item->>'sortOrder')::int, 0),
      ${userId},
      ${displayName}
    from h
    cross join jsonb_array_elements(${payload}::jsonb) as item
    where exists (select 1 from m)
  `;
}

export const getBoard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<BoardState> => {
    const sql = await getSql();
    return loadBoard(sql, context.userId);
  });

export const createHousehold = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const record = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
    return { name: cleanText(record.name, 80) };
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<MutationResult> => {
    const sql = await getSql();
    const existing = await loadBoard(sql, context.userId);
    if (existing.household) return { ok: true, board: existing };

    const displayName = existing.viewerName;
    const listName = data.name || "Leaving the house";

    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        await insertHousehold(sql, context.userId, displayName, listName, makeCode());
        return { ok: true, board: await loadBoard(sql, context.userId) };
      } catch (error) {
        if (!isUniqueViolation(error)) throw error;
        const again = await loadBoard(sql, context.userId);
        if (again.household) return { ok: true, board: again };
      }
    }
    return { ok: false, error: "Could not start the list. Please try again." };
  });

export const joinHousehold = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const record = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
    const code =
      typeof record.code === "string" ? record.code.toUpperCase().replace(/[^A-Z0-9]/g, "") : "";
    return { code };
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<MutationResult> => {
    if (data.code.length !== 6) {
      return { ok: false, error: "Enter the 6-character family code." };
    }
    const sql = await getSql();
    const already = await loadBoard(sql, context.userId);
    if (already.household?.joinCode === data.code) return { ok: true, board: already };
    if (already.household) {
      return {
        ok: false,
        error: "You are already on a list. Leave that one first, then enter this code.",
      };
    }

    const homes = await sql<{ id: string }>`
      select id from households where join_code = ${data.code}
    `;
    const home = homes[0];
    if (!home) {
      return { ok: false, error: "That code does not match a list. Check the letters and try again." };
    }

    const name = already.viewerName;
    try {
      await sql`
        insert into household_members (household_id, user_id, display_name)
        values (${home.id}, ${context.userId}, ${name})
      `;
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
    }
    return { ok: true, board: await loadBoard(sql, context.userId) };
  });

export const leaveHousehold = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<MutationResult> => {
    const sql = await getSql();
    const householdId = await memberHouseholdId(sql, context.userId);
    if (!householdId) return { ok: true, board: await loadBoard(sql, context.userId) };
    await sql`
      delete from household_members
      where user_id = ${context.userId} and household_id = ${householdId}
    `;
    await sql`
      delete from households
      where id = ${householdId}
        and not exists (
          select 1 from household_members where household_id = ${householdId}
        )
    `;
    return { ok: true, board: await loadBoard(sql, context.userId) };
  });

export const addTask = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const record = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
    return {
      title: cleanText(record.title, 180),
      detail: noteText(record.detail),
      phase: typeof record.phase === "string" ? record.phase : "",
      assignee: typeof record.assignee === "string" ? record.assignee : "",
    };
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<MutationResult> => {
    if (data.title.length < 2) {
      return { ok: false, error: "Give the task a short name." };
    }
    if (!isPhaseId(data.phase)) return { ok: false, error: "Choose which part of the move this belongs to." };
    if (!isAssignee(data.assignee)) return { ok: false, error: "Choose who should do it." };

    const sql = await getSql();
    const householdId = await memberHouseholdId(sql, context.userId);
    if (!householdId) return { ok: false, error: "Start or join the family list first." };
    const name = await viewerName(sql, context.userId);
    const orders = await sql<{ next: number }>`
      select coalesce(max(sort_order), 0) + 10 as next
      from tasks
      where household_id = ${householdId}
    `;
    await sql`
      insert into tasks (
        id, household_id, title, detail, phase, assignee, sort_order, added_by, added_by_name
      ) values (
        ${crypto.randomUUID()},
        ${householdId},
        ${data.title},
        ${data.detail},
        ${data.phase},
        ${data.assignee},
        ${orders[0]?.next ?? 10},
        ${context.userId},
        ${name}
      )
    `;
    return { ok: true, board: await loadBoard(sql, context.userId) };
  });

type TaskPatch = {
  id: string;
  status?: TaskStatus;
  assignee?: string;
  note?: string;
  title?: string;
  detail?: string;
};

export const updateTask = createServerFn({ method: "POST" })
  .validator((input: unknown): TaskPatch => {
    const record = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
    const patch: TaskPatch = { id: cleanText(record.id, 80) };
    if (typeof record.status === "string") patch.status = asStatus(record.status);
    if (typeof record.assignee === "string") patch.assignee = record.assignee;
    if (typeof record.note === "string") patch.note = noteText(record.note);
    if (typeof record.title === "string") patch.title = cleanText(record.title, 180);
    if (typeof record.detail === "string") patch.detail = noteText(record.detail);
    return patch;
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<MutationResult> => {
    if (!data.id) return { ok: false, error: "Missing task." };
    if (data.assignee !== undefined && !isAssignee(data.assignee)) {
      return { ok: false, error: "Choose who should do it." };
    }
    if (data.title !== undefined && data.title.length < 2) {
      return { ok: false, error: "Give the task a short name." };
    }
    if (data.status && data.status !== "open" && data.status !== "done" && data.status !== "skipped") {
      return { ok: false, error: "That status is not valid." };
    }

    const sql = await getSql();
    const householdId = await memberHouseholdId(sql, context.userId);
    if (!householdId) return { ok: false, error: "Start or join the family list first." };
    const name = await viewerName(sql, context.userId);

    const sets = ["updated_at = now()"];
    const params: unknown[] = [];
    const add = (column: string, value: unknown) => {
      params.push(value);
      sets.push(`${column} = $${params.length}`);
    };

    if (data.status) {
      add("status", data.status);
      sets.push(data.status === "done" ? "completed_at = now()" : "completed_at = null");
    }
    if (data.assignee) add("assignee", data.assignee);
    if (data.note !== undefined) {
      add("note", data.note);
      add("note_by_name", data.note ? name : "");
    }
    if (data.title !== undefined) add("title", data.title);
    if (data.detail !== undefined) add("detail", data.detail);

    params.push(data.id);
    const idIndex = params.length;
    params.push(householdId);
    const homeIndex = params.length;
    const updated = await sql.query<{ id: string }>(
      `update tasks set ${sets.join(", ")} where id = $${idIndex} and household_id = $${homeIndex} returning id`,
      params,
    );
    if (!updated.length) return { ok: false, error: "That task is not on your list." };
    return { ok: true, board: await loadBoard(sql, context.userId) };
  });

export const deleteTask = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const record = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
    return { id: cleanText(record.id, 80) };
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<MutationResult> => {
    if (!data.id) return { ok: false, error: "Missing task." };
    const sql = await getSql();
    const householdId = await memberHouseholdId(sql, context.userId);
    if (!householdId) return { ok: false, error: "Start or join the family list first." };
    await sql`
      delete from tasks where id = ${data.id} and household_id = ${householdId}
    `;
    return { ok: true, board: await loadBoard(sql, context.userId) };
  });

export const phaseIds = PHASES.map((phase) => phase.id);
export const assigneeOptions = ASSIGNEES;
