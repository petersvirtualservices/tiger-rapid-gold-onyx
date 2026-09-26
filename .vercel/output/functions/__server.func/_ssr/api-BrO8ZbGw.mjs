import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CMs5_uDl.mjs";
import { a as isAssignee, i as authMiddleware, o as isPhaseId, r as SEED_TASKS } from "./catalog-CT2RNDWL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-BrO8ZbGw.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function makeCode() {
	const bytes = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(6));
	return Array.from(bytes, (byte) => CODE_ALPHABET[byte % 32]).join("");
}
function asBool(value) {
	return value === true || value === "t" || value === "true" || value === 1;
}
function asStatus(value) {
	return value === "done" || value === "skipped" ? value : "open";
}
function cleanText(value, max) {
	if (typeof value !== "string") return "";
	return value.replace(/\s+/g, " ").trim().slice(0, max);
}
function noteText(value) {
	if (typeof value !== "string") return "";
	return value.replace(/\r\n/g, "\n").trim().slice(0, 2e3);
}
function isUniqueViolation(error) {
	return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}
async function viewerName(sql, userId) {
	const rows = await sql`
    select name, email from "user" where id = ${userId}
  `;
	const name = rows[0]?.name?.trim();
	if (name) return name.slice(0, 80);
	return rows[0]?.email?.split("@")[0]?.trim() || "Family member";
}
async function memberHouseholdId(sql, userId) {
	return (await sql`
    select household_id from household_members where user_id = ${userId} limit 1
  `)[0]?.household_id ?? null;
}
function mapTask(row) {
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
		addedByName: String(row.addedByName ?? "")
	};
}
async function loadBoard(sql, userId) {
	const name = await viewerName(sql, userId);
	const householdId = await memberHouseholdId(sql, userId);
	if (!householdId) return {
		viewerName: name,
		household: null,
		tasks: []
	};
	const home = (await sql`
    select id, name, join_code as "joinCode"
    from households
    where id = ${householdId}
  `)[0];
	if (!home) return {
		viewerName: name,
		household: null,
		tasks: []
	};
	const members = await sql`
    select user_id as "userId", display_name as "displayName"
    from household_members
    where household_id = ${householdId}
    order by joined_at asc
  `;
	const tasks = await sql`
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
			members
		},
		tasks: tasks.map(mapTask)
	};
}
async function insertHousehold(sql, userId, displayName, listName, code) {
	const payload = JSON.stringify(SEED_TASKS.map((task, index) => ({
		id: crypto.randomUUID(),
		title: task.title,
		detail: task.detail,
		phase: task.phase,
		assignee: task.assignee,
		pinned: task.pinned,
		pinOrder: task.pinOrder,
		sortOrder: (index + 1) * 10
	})));
	await sql`
    with h as (
      insert into households (id, name, join_code, created_by)
      values (${crypto.randomUUID()}, ${listName}, ${code}, ${userId})
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
var getBoard_createServerFn_handler = createServerRpc({
	id: "e43b2b3b017acb671001e4bbe51eabf3690b1566101243a051f611d1a2579820",
	name: "getBoard",
	filename: "src/lib/move/api.ts"
}, (opts) => getBoard.__executeServer(opts));
var getBoard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getBoard_createServerFn_handler, async ({ context }) => {
	return loadBoard(await getSql(), context.userId);
});
var createHousehold_createServerFn_handler = createServerRpc({
	id: "f69881ea703d72062fabb37b1460b8a2027b49c2ddde8d8c9376ab98562dea7d",
	name: "createHousehold",
	filename: "src/lib/move/api.ts"
}, (opts) => createHousehold.__executeServer(opts));
var createHousehold = createServerFn({ method: "POST" }).validator((input) => {
	return { name: cleanText((input && typeof input === "object" ? input : {}).name, 80) };
}).middleware([authMiddleware]).handler(createHousehold_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const existing = await loadBoard(sql, context.userId);
	if (existing.household) return {
		ok: true,
		board: existing
	};
	const displayName = existing.viewerName;
	const listName = data.name || "Leaving the house";
	for (let attempt = 0; attempt < 5; attempt += 1) try {
		await insertHousehold(sql, context.userId, displayName, listName, makeCode());
		return {
			ok: true,
			board: await loadBoard(sql, context.userId)
		};
	} catch (error) {
		if (!isUniqueViolation(error)) throw error;
		const again = await loadBoard(sql, context.userId);
		if (again.household) return {
			ok: true,
			board: again
		};
	}
	return {
		ok: false,
		error: "Could not start the list. Please try again."
	};
});
var joinHousehold_createServerFn_handler = createServerRpc({
	id: "24bbad150a48f7b406163109c262512395a5b596767eeb6941e06362b3daa453",
	name: "joinHousehold",
	filename: "src/lib/move/api.ts"
}, (opts) => joinHousehold.__executeServer(opts));
var joinHousehold = createServerFn({ method: "POST" }).validator((input) => {
	const record = input && typeof input === "object" ? input : {};
	return { code: typeof record.code === "string" ? record.code.toUpperCase().replace(/[^A-Z0-9]/g, "") : "" };
}).middleware([authMiddleware]).handler(joinHousehold_createServerFn_handler, async ({ context, data }) => {
	if (data.code.length !== 6) return {
		ok: false,
		error: "Enter the 6-character family code."
	};
	const sql = await getSql();
	const already = await loadBoard(sql, context.userId);
	if (already.household?.joinCode === data.code) return {
		ok: true,
		board: already
	};
	if (already.household) return {
		ok: false,
		error: "You are already on a list. Leave that one first, then enter this code."
	};
	const home = (await sql`
      select id from households where join_code = ${data.code}
    `)[0];
	if (!home) return {
		ok: false,
		error: "That code does not match a list. Check the letters and try again."
	};
	const name = already.viewerName;
	try {
		await sql`
        insert into household_members (household_id, user_id, display_name)
        values (${home.id}, ${context.userId}, ${name})
      `;
	} catch (error) {
		if (!isUniqueViolation(error)) throw error;
	}
	return {
		ok: true,
		board: await loadBoard(sql, context.userId)
	};
});
var leaveHousehold_createServerFn_handler = createServerRpc({
	id: "1cd3c19aa35a11b7e64f8a332980de3228e9939827fb5bbe4d55b6f6b78f851c",
	name: "leaveHousehold",
	filename: "src/lib/move/api.ts"
}, (opts) => leaveHousehold.__executeServer(opts));
var leaveHousehold = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(leaveHousehold_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const householdId = await memberHouseholdId(sql, context.userId);
	if (!householdId) return {
		ok: true,
		board: await loadBoard(sql, context.userId)
	};
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
	return {
		ok: true,
		board: await loadBoard(sql, context.userId)
	};
});
var addTask_createServerFn_handler = createServerRpc({
	id: "49411b29e5af1eb45dcad538561f9b4b3119fa724ea3b574c1d68ddadfb79580",
	name: "addTask",
	filename: "src/lib/move/api.ts"
}, (opts) => addTask.__executeServer(opts));
var addTask = createServerFn({ method: "POST" }).validator((input) => {
	const record = input && typeof input === "object" ? input : {};
	return {
		title: cleanText(record.title, 180),
		detail: noteText(record.detail),
		phase: typeof record.phase === "string" ? record.phase : "",
		assignee: typeof record.assignee === "string" ? record.assignee : ""
	};
}).middleware([authMiddleware]).handler(addTask_createServerFn_handler, async ({ context, data }) => {
	if (data.title.length < 2) return {
		ok: false,
		error: "Give the task a short name."
	};
	if (!isPhaseId(data.phase)) return {
		ok: false,
		error: "Choose which part of the move this belongs to."
	};
	if (!isAssignee(data.assignee)) return {
		ok: false,
		error: "Choose who should do it."
	};
	const sql = await getSql();
	const householdId = await memberHouseholdId(sql, context.userId);
	if (!householdId) return {
		ok: false,
		error: "Start or join the family list first."
	};
	const name = await viewerName(sql, context.userId);
	const orders = await sql`
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
	return {
		ok: true,
		board: await loadBoard(sql, context.userId)
	};
});
var updateTask_createServerFn_handler = createServerRpc({
	id: "d2a61953d064366117bbe04745ef2274c76024a291de31056e0e613b9135574c",
	name: "updateTask",
	filename: "src/lib/move/api.ts"
}, (opts) => updateTask.__executeServer(opts));
var updateTask = createServerFn({ method: "POST" }).validator((input) => {
	const record = input && typeof input === "object" ? input : {};
	const patch = { id: cleanText(record.id, 80) };
	if (typeof record.status === "string") patch.status = asStatus(record.status);
	if (typeof record.assignee === "string") patch.assignee = record.assignee;
	if (typeof record.note === "string") patch.note = noteText(record.note);
	if (typeof record.title === "string") patch.title = cleanText(record.title, 180);
	if (typeof record.detail === "string") patch.detail = noteText(record.detail);
	return patch;
}).middleware([authMiddleware]).handler(updateTask_createServerFn_handler, async ({ context, data }) => {
	if (!data.id) return {
		ok: false,
		error: "Missing task."
	};
	if (data.assignee !== void 0 && !isAssignee(data.assignee)) return {
		ok: false,
		error: "Choose who should do it."
	};
	if (data.title !== void 0 && data.title.length < 2) return {
		ok: false,
		error: "Give the task a short name."
	};
	if (data.status && data.status !== "open" && data.status !== "done" && data.status !== "skipped") return {
		ok: false,
		error: "That status is not valid."
	};
	const sql = await getSql();
	const householdId = await memberHouseholdId(sql, context.userId);
	if (!householdId) return {
		ok: false,
		error: "Start or join the family list first."
	};
	const name = await viewerName(sql, context.userId);
	const sets = ["updated_at = now()"];
	const params = [];
	const add = (column, value) => {
		params.push(value);
		sets.push(`${column} = $${params.length}`);
	};
	if (data.status) {
		add("status", data.status);
		sets.push(data.status === "done" ? "completed_at = now()" : "completed_at = null");
	}
	if (data.assignee) add("assignee", data.assignee);
	if (data.note !== void 0) {
		add("note", data.note);
		add("note_by_name", data.note ? name : "");
	}
	if (data.title !== void 0) add("title", data.title);
	if (data.detail !== void 0) add("detail", data.detail);
	params.push(data.id);
	const idIndex = params.length;
	params.push(householdId);
	const homeIndex = params.length;
	if (!(await sql.query(`update tasks set ${sets.join(", ")} where id = $${idIndex} and household_id = $${homeIndex} returning id`, params)).length) return {
		ok: false,
		error: "That task is not on your list."
	};
	return {
		ok: true,
		board: await loadBoard(sql, context.userId)
	};
});
var deleteTask_createServerFn_handler = createServerRpc({
	id: "723a682fa137937ffd0754fceb37da1d5cd5414746a82d038cc850aa043fb440",
	name: "deleteTask",
	filename: "src/lib/move/api.ts"
}, (opts) => deleteTask.__executeServer(opts));
var deleteTask = createServerFn({ method: "POST" }).validator((input) => {
	return { id: cleanText((input && typeof input === "object" ? input : {}).id, 80) };
}).middleware([authMiddleware]).handler(deleteTask_createServerFn_handler, async ({ context, data }) => {
	if (!data.id) return {
		ok: false,
		error: "Missing task."
	};
	const sql = await getSql();
	const householdId = await memberHouseholdId(sql, context.userId);
	if (!householdId) return {
		ok: false,
		error: "Start or join the family list first."
	};
	await sql`
      delete from tasks where id = ${data.id} and household_id = ${householdId}
    `;
	return {
		ok: true,
		board: await loadBoard(sql, context.userId)
	};
});
//#endregion
export { addTask_createServerFn_handler, createHousehold_createServerFn_handler, deleteTask_createServerFn_handler, getBoard_createServerFn_handler, joinHousehold_createServerFn_handler, leaveHousehold_createServerFn_handler, updateTask_createServerFn_handler };
