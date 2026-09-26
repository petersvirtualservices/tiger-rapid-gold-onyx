import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  Check,
  ClipboardCheck,
  Copy,
  Droplets,
  Phone,
  Trash2,
  Warehouse,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  ASSIGNEES,
  PHASES,
  SEED_TASKS,
  phaseHeading,
  type BoardState,
  type MutationResult,
  type Task,
  type TaskStatus,
} from "@/lib/move/catalog";
import {
  addTask,
  createHousehold,
  deleteTask,
  getBoard,
  joinHousehold,
  leaveHousehold,
  updateTask,
} from "@/lib/move/api";
import { Shell } from "@/components/shell";
import { SignInPanel } from "@/components/sign-in-panel";

const PIN_ICONS: Record<number, LucideIcon> = {
  1: Wifi,
  2: Phone,
  3: Droplets,
  4: ClipboardCheck,
  5: Warehouse,
  6: Trash2,
};

type View = "open" | "all" | "done" | "skipped";

function errorText(error: unknown): string {
  if (error instanceof Error && error.message) {
    if (error.message === "Unauthorized") return "Please sign in again.";
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

function matches(task: Task, view: View, phase: string, query: string): boolean {
  if (phase !== "all" && task.phase !== phase) return false;
  if (query) {
    const haystack = `${task.title} ${task.detail} ${task.note} ${task.assignee}`.toLowerCase();
    if (!haystack.includes(query.toLowerCase())) return false;
  }
  if (view === "open") return task.status === "open";
  if (view === "done") return task.status === "done";
  if (view === "skipped") return task.status === "skipped";
  return true;
}

function PreviewList() {
  const pinned = SEED_TASKS.filter((task) => task.pinned).sort((a, b) => a.pinOrder - b.pinOrder);
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-2xl font-semibold">Already on the list</h2>
      <p className="text-pretty text-muted">
        These are the ones you named. A full move out of a fifty-year house is under them, from
        the deed folder to the last meter reading.
      </p>
      <ul className="flex flex-col gap-3">
        {pinned.map((task) => {
          const Icon = PIN_ICONS[task.pinOrder] ?? ClipboardCheck;
          return (
            <li key={task.title} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-bold">{task.title}</h3>
                  <p className="mt-1 text-pretty text-muted">{task.detail}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <ul className="mt-2 flex flex-col gap-1 text-muted">
        {PHASES.map((phase) => {
          const count = SEED_TASKS.filter((task) => task.phase === phase.id && !task.pinned).length;
          if (!count) return null;
          return (
            <li key={phase.id}>
              {phase.heading} · {count} more
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function GuestHome() {
  return (
    <div className="flex flex-col gap-6">
      <SignInPanel />
      <PreviewList />
    </div>
  );
}

function LoadingList() {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      <div className="h-28 animate-pulse rounded-2xl bg-line" />
      <div className="h-24 animate-pulse rounded-2xl bg-line" />
      <div className="h-24 animate-pulse rounded-2xl bg-line" />
    </div>
  );
}

function Lobby({
  busy,
  error,
  onStart,
  onJoin,
}: {
  busy: boolean;
  error: string | null;
  onStart: (name: string) => void;
  onJoin: (code: string) => void;
}) {
  const [listName, setListName] = useState("Leaving the house");
  const [joining, setJoining] = useState(false);
  const [code, setCode] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <h2 className="font-display text-2xl font-semibold">Start the family list</h2>
        <p className="mt-2 text-pretty text-muted">
          This puts the moving list on one page. You will get a short code. Mom and Dad sign in,
          enter that code, and see the same checks and notes.
        </p>
        <label className="mt-4 flex flex-col gap-1 font-bold">
          Name for this list
          <input
            value={listName}
            onChange={(event) => setListName(event.target.value)}
            className="min-h-11 rounded-xl border border-line bg-bg px-3 font-normal"
          />
        </label>
        {error ? (
          <p role="alert" className="mt-3 text-accent">
            {error}
          </p>
        ) : null}
        <button
          type="button"
          disabled={busy}
          className="mt-4 min-h-11 w-full rounded-xl bg-primary px-4 font-bold text-primary-fg disabled:cursor-wait disabled:opacity-70"
          onClick={() => onStart(listName)}
        >
          {busy ? "Starting…" : "Start our shared list"}
        </button>
        <button
          type="button"
          className="mt-2 min-h-11 w-full rounded-xl border border-line px-4 font-bold"
          onClick={() => setJoining((open) => !open)}
        >
          I have a family code
        </button>
        {joining ? (
          <form
            className="mt-3 flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              onJoin(code);
            }}
          >
            <label className="flex flex-col gap-1 font-bold">
              Family code
              <input
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                maxLength={11}
                className="min-h-12 rounded-xl border border-line bg-bg px-3 text-center font-display text-2xl tracking-widest uppercase"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="min-h-11 rounded-xl bg-primary px-4 font-bold text-primary-fg disabled:opacity-70"
            >
              Join the list
            </button>
          </form>
        ) : null}
      </section>
      <PreviewList />
    </div>
  );
}

function TaskCard({
  task,
  busy,
  onStatus,
  onAssignee,
  onNote,
  onEdit,
  onDelete,
}: {
  task: Task;
  busy: boolean;
  onStatus: (status: TaskStatus) => void;
  onAssignee: (assignee: string) => void;
  onNote: (note: string) => void;
  onEdit: (title: string, detail: string) => void;
  onDelete: () => void;
}) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState(task.note);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [detail, setDetail] = useState(task.detail);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const done = task.status === "done";
  const skipped = task.status === "skipped";
  const Icon = task.pinned ? PIN_ICONS[task.pinOrder] : undefined;

  useEffect(() => {
    if (!noteOpen) setNote(task.note);
  }, [task.note, noteOpen]);

  return (
    <article className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
      <div className="flex gap-3">
        <button
          type="button"
          aria-pressed={done}
          aria-label={done ? `Mark not done: ${task.title}` : `Mark done: ${task.title}`}
          disabled={busy || skipped}
          className="grid size-11 shrink-0 place-items-center"
          onClick={() => onStatus(done ? "open" : "done")}
        >
          <span
            className={
              done
                ? "grid size-7 place-items-center rounded-md border-2 border-primary bg-primary text-primary-fg"
                : "grid size-7 place-items-center rounded-md border-2 border-primary bg-surface"
            }
          >
            {done ? <Check className="size-4" aria-hidden="true" /> : null}
          </span>
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {Icon ? <Icon className="size-4 text-accent" aria-hidden="true" /> : null}
            {task.pinned ? (
              <span className="text-sm font-bold tracking-wide text-accent uppercase">
                You asked for this
              </span>
            ) : null}
            {skipped ? (
              <span className="text-sm font-bold tracking-wide text-muted uppercase">Not for us</span>
            ) : null}
          </div>
          {editing ? (
            <form
              className="mt-2 flex flex-col gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                onEdit(title, detail);
                setEditing(false);
              }}
            >
              <label className="flex flex-col gap-1 font-bold">
                Task
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="min-h-11 rounded-xl border border-line bg-bg px-3 font-normal"
                />
              </label>
              <label className="flex flex-col gap-1 font-bold">
                Detail
                <textarea
                  value={detail}
                  onChange={(event) => setDetail(event.target.value)}
                  rows={4}
                  className="rounded-xl border border-line bg-bg px-3 py-2 font-normal"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="min-h-11 rounded-xl bg-primary px-4 font-bold text-primary-fg"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  className="min-h-11 rounded-xl border border-line px-4 font-bold"
                  onClick={() => {
                    setTitle(task.title);
                    setDetail(task.detail);
                    setEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3 className={done ? "font-bold text-muted line-through" : "font-bold"}>{task.title}</h3>
              <p className="mt-1 text-pretty text-muted">{task.detail}</p>
            </>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="flex min-h-11 items-center gap-2 font-bold">
              <span className="text-muted">Who</span>
              <select
                value={ASSIGNEES.includes(task.assignee as (typeof ASSIGNEES)[number]) ? task.assignee : "Anyone"}
                onChange={(event) => onAssignee(event.target.value)}
                disabled={busy}
                className="min-h-11 rounded-xl border border-line bg-bg px-2 font-normal"
              >
                {ASSIGNEES.map((assignee) => (
                  <option key={assignee} value={assignee}>
                    {assignee}
                  </option>
                ))}
              </select>
            </label>
            <span className="text-muted">Added by {task.addedByName}</span>
          </div>
          {task.note && !noteOpen ? (
            <p className="mt-3 rounded-xl bg-accent-soft px-3 py-2 text-pretty text-ink">
              <span className="font-bold">{task.noteByName ? `${task.noteByName}: ` : "Note: "}</span>
              {task.note}
            </p>
          ) : null}
          {noteOpen ? (
            <form
              className="mt-3 flex flex-col gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                onNote(note);
                setNoteOpen(false);
              }}
            >
              <label className="flex flex-col gap-1 font-bold">
                Note for the family
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={3}
                  className="rounded-xl border border-line bg-bg px-3 py-2 font-normal"
                  placeholder="Account number, appointment date, what they told you on the phone"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="min-h-11 rounded-xl bg-primary px-4 font-bold text-primary-fg"
                >
                  Save note
                </button>
                <button
                  type="button"
                  className="min-h-11 rounded-xl border border-line px-4 font-bold"
                  onClick={() => {
                    setNote(task.note);
                    setNoteOpen(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {!noteOpen ? (
              <button
                type="button"
                className="min-h-11 rounded-xl border border-line px-3 font-bold"
                onClick={() => setNoteOpen(true)}
              >
                {task.note ? "Edit note" : "Add a note"}
              </button>
            ) : null}
            {!editing ? (
              <button
                type="button"
                className="min-h-11 rounded-xl border border-line px-3 font-bold"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            ) : null}
            <button
              type="button"
              className="min-h-11 rounded-xl border border-line px-3 font-bold"
              onClick={() => onStatus(skipped ? "open" : "skipped")}
              disabled={busy}
            >
              {skipped ? "Put back on the list" : "Not for us"}
            </button>
            {confirmRemove ? (
              <>
                <button
                  type="button"
                  className="min-h-11 rounded-xl bg-accent px-3 font-bold text-primary-fg"
                  onClick={onDelete}
                >
                  Yes, remove
                </button>
                <button
                  type="button"
                  className="min-h-11 rounded-xl border border-line px-3 font-bold"
                  onClick={() => setConfirmRemove(false)}
                >
                  Keep it
                </button>
              </>
            ) : (
              <button
                type="button"
                className="min-h-11 rounded-xl px-3 font-bold text-muted"
                onClick={() => setConfirmRemove(true)}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function Board({
  board,
  error,
  onCommit,
}: {
  board: BoardState;
  error: string | null;
  onCommit: (run: () => Promise<MutationResult>) => Promise<boolean>;
}) {
  const household = board.household;
  const [view, setView] = useState<View>("open");
  const [phase, setPhase] = useState("all");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [newPhase, setNewPhase] = useState("utilities");
  const [assignee, setAssignee] = useState("Anyone");
  const [busy, setBusy] = useState(false);
  const [leaveAsk, setLeaveAsk] = useState(false);

  if (!household) return null;

  const openCount = board.tasks.filter((task) => task.status === "open").length;
  const doneCount = board.tasks.filter((task) => task.status === "done").length;
  const skippedCount = board.tasks.filter((task) => task.status === "skipped").length;
  const actionable = openCount + doneCount;
  const percent = actionable === 0 ? 0 : Math.round((doneCount / actionable) * 100);
  const shown = (task: Task) => matches(task, view, phase, query.trim());
  const pinned = board.tasks.filter((task) => task.pinned && shown(task));
  const code = household.joinCode;
  const prettyCode = `${code.slice(0, 3)} ${code.slice(3)}`;

  async function commit(run: () => Promise<MutationResult>) {
    setBusy(true);
    const ok = await onCommit(run);
    setBusy(false);
    return ok;
  }

  async function onAdd(event: FormEvent) {
    event.preventDefault();
    const ok = await commit(() =>
      addTask({ data: { title, detail, phase: newPhase, assignee } }),
    );
    if (ok) {
      setTitle("");
      setDetail("");
      setAdding(false);
      setView("all");
      setPhase("all");
      setQuery("");
    }
  }

  const views: { id: View; label: string; count: number }[] = [
    { id: "open", label: "Still to do", count: openCount },
    { id: "all", label: "Everything", count: board.tasks.length },
    { id: "done", label: "Finished", count: doneCount },
    { id: "skipped", label: "Set aside", count: skippedCount },
  ];

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <p className="font-display text-2xl font-semibold">{household.name}</p>
        <p className="mt-1 tabular-nums text-muted">
          {doneCount} finished · {openCount} still to do
          {skippedCount ? ` · ${skippedCount} set aside` : ""}
        </p>
        <div className="meter mt-3" aria-hidden="true">
          <span style={{ width: `${percent}%` }} />
        </div>
        <p className="sr-only">{percent} percent of the remaining work is finished.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div>
            <p className="text-sm font-bold tracking-wide text-muted uppercase">Family code</p>
            <p className="font-display text-3xl tracking-widest">{prettyCode}</p>
          </div>
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3 font-bold"
            onClick={() => {
              void navigator.clipboard.writeText(code).then(
                () => {
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                },
                () => setCopied(false),
              );
            }}
          >
            <Copy className="size-4" aria-hidden="true" />
            {copied ? "Copied" : "Copy code"}
          </button>
        </div>
        <p className="mt-3 text-pretty text-muted">
          Give this code only to Mom and Dad. They sign in, choose “I have a family code,” and
          type it. Checks and notes then show up here on their screens too.
        </p>
        <p className="mt-2 text-muted">
          On this list: {household.members.map((member) => member.displayName).join(", ")}
        </p>
      </section>

      {error ? (
        <p role="alert" className="rounded-xl bg-accent-soft px-3 py-2 text-accent">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 font-bold">
          Find a task
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-h-11 rounded-xl border border-line bg-surface px-3 font-normal"
            placeholder="Trash, T-Mobile, locker…"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {views.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={view === item.id}
              className={
                view === item.id
                  ? "min-h-11 rounded-full bg-primary px-4 font-bold text-primary-fg"
                  : "min-h-11 rounded-full border border-line bg-surface px-4 font-bold"
              }
              onClick={() => setView(item.id)}
            >
              {item.label} <span className="tabular-nums">{item.count}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={phase === "all"} onClick={() => setPhase("all")}>
            All areas
          </FilterChip>
          {PHASES.map((item) => (
            <FilterChip
              key={item.id}
              active={phase === item.id}
              onClick={() => setPhase(item.id)}
            >
              {item.label}
            </FilterChip>
          ))}
        </div>
      </div>

      <section className="rounded-2xl border border-dashed border-line bg-surface p-4">
        {adding ? (
          <form className="flex flex-col gap-3" onSubmit={onAdd}>
            <h2 className="font-display text-2xl font-semibold">Add something</h2>
            <label className="flex flex-col gap-1 font-bold">
              What needs doing
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="min-h-11 rounded-xl border border-line bg-bg px-3 font-normal"
                required
              />
            </label>
            <label className="flex flex-col gap-1 font-bold">
              Detail, if it helps
              <textarea
                value={detail}
                onChange={(event) => setDetail(event.target.value)}
                rows={3}
                className="rounded-xl border border-line bg-bg px-3 py-2 font-normal"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 font-bold">
                Which part of the move
                <select
                  value={newPhase}
                  onChange={(event) => setNewPhase(event.target.value)}
                  className="min-h-11 rounded-xl border border-line bg-bg px-2 font-normal"
                >
                  {PHASES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 font-bold">
                Who should do it
                <select
                  value={assignee}
                  onChange={(event) => setAssignee(event.target.value)}
                  className="min-h-11 rounded-xl border border-line bg-bg px-2 font-normal"
                >
                  {ASSIGNEES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={busy}
                className="min-h-11 rounded-xl bg-primary px-4 font-bold text-primary-fg disabled:opacity-70"
              >
                Add to the list
              </button>
              <button
                type="button"
                className="min-h-11 rounded-xl border border-line px-4 font-bold"
                onClick={() => setAdding(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            className="min-h-11 w-full rounded-xl bg-primary px-4 font-bold text-primary-fg"
            onClick={() => {
              setNewPhase(phase === "all" ? "utilities" : phase);
              setAdding(true);
            }}
          >
            Add something we still need to do
          </button>
        )}
      </section>

      {pinned.length ? (
        <section id="start-here" className="flex flex-col gap-3">
          <h2 className="font-display text-2xl font-semibold">Start here</h2>
          {pinned.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              busy={busy}
              onStatus={(status) => void commit(() => updateTask({ data: { id: task.id, status } }))}
              onAssignee={(next) => void commit(() => updateTask({ data: { id: task.id, assignee: next } }))}
              onNote={(note) => void commit(() => updateTask({ data: { id: task.id, note } }))}
              onEdit={(nextTitle, nextDetail) =>
                void commit(() =>
                  updateTask({ data: { id: task.id, title: nextTitle, detail: nextDetail } }),
                )
              }
              onDelete={() => void commit(() => deleteTask({ data: { id: task.id } }))}
            />
          ))}
        </section>
      ) : null}

      {PHASES.map((item) => {
        const tasks = board.tasks.filter((task) => !task.pinned && task.phase === item.id && shown(task));
        if (!tasks.length) return null;
        return (
          <section key={item.id} id={`phase-${item.id}`} className="flex flex-col gap-3">
            <h2 className="font-display text-2xl font-semibold">{phaseHeading(item.id)}</h2>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                busy={busy}
                onStatus={(status) => void commit(() => updateTask({ data: { id: task.id, status } }))}
                onAssignee={(next) =>
                  void commit(() => updateTask({ data: { id: task.id, assignee: next } }))
                }
                onNote={(note) => void commit(() => updateTask({ data: { id: task.id, note } }))}
                onEdit={(nextTitle, nextDetail) =>
                  void commit(() =>
                    updateTask({ data: { id: task.id, title: nextTitle, detail: nextDetail } }),
                  )
                }
                onDelete={() => void commit(() => deleteTask({ data: { id: task.id } }))}
              />
            ))}
          </section>
        );
      })}

      {!pinned.length && !board.tasks.some((task) => !task.pinned && shown(task)) ? (
        <p className="text-pretty text-muted">
          Nothing in this view. Try “Still to do,” or add a task of your own.
        </p>
      ) : null}

      <section className="border-t border-line pt-4">
        {leaveAsk ? (
          <div className="flex flex-col gap-2">
            <p className="text-pretty">
              Leave this list? If you are the last person on it, the list is deleted.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="min-h-11 rounded-xl bg-accent px-4 font-bold text-primary-fg"
                onClick={() => void commit(() => leaveHousehold())}
              >
                Leave the list
              </button>
              <button
                type="button"
                className="min-h-11 rounded-xl border border-line px-4 font-bold"
                onClick={() => setLeaveAsk(false)}
              >
                Stay
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="min-h-11 font-bold text-muted underline-offset-4 hover:underline"
            onClick={() => setLeaveAsk(true)}
          >
            Leave this list
          </button>
        )}
      </section>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        active
          ? "min-h-11 rounded-full bg-primary-soft px-3 font-bold text-primary"
          : "min-h-11 rounded-full border border-line bg-surface px-3 font-bold text-ink"
      }
    >
      {children}
    </button>
  );
}

function FamilyBoard() {
  const [board, setBoard] = useState<BoardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const epoch = useRef(0);

  useEffect(() => {
    let cancel = false;
    const refresh = async () => {
      const ticket = ++epoch.current;
      try {
        const next = await getBoard();
        if (cancel || ticket !== epoch.current) return;
        setBoard(next);
        setError(null);
      } catch (err) {
        if (cancel || ticket !== epoch.current) return;
        setError(errorText(err));
      } finally {
        if (!cancel && ticket === epoch.current) setLoading(false);
      }
    };
    void refresh();
    const timer = window.setInterval(() => {
      void refresh();
    }, 10000);
    return () => {
      cancel = true;
      window.clearInterval(timer);
    };
  }, []);

  async function commit(run: () => Promise<MutationResult>): Promise<boolean> {
    ++epoch.current;
    try {
      const result = await run();
      ++epoch.current;
      if (!result.ok) {
        setError(result.error);
        return false;
      }
      setBoard(result.board);
      setError(null);
      return true;
    } catch (err) {
      ++epoch.current;
      setError(errorText(err));
      return false;
    }
  }

  if (loading && !board) return <LoadingList />;
  if (!board) {
    return (
      <div className="flex flex-col gap-3">
        <p role="alert">{error ?? "The list could not be loaded."}</p>
        <button
          type="button"
          className="min-h-11 w-fit rounded-xl bg-primary px-4 font-bold text-primary-fg"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }
  if (!board.household) {
    return (
      <Lobby
        busy={busy}
        error={error}
        onStart={(name) => {
          setBusy(true);
          void commit(() => createHousehold({ data: { name } })).finally(() => setBusy(false));
        }}
        onJoin={(code) => {
          setBusy(true);
          void commit(() => joinHousehold({ data: { code } })).finally(() => setBusy(false));
        }}
      />
    );
  }
  return <Board board={board} error={error} onCommit={commit} />;
}

export function MoveApp() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <Shell>
        <LoadingList />
      </Shell>
    );
  }
  if (!user) {
    return (
      <Shell>
        <GuestHome />
      </Shell>
    );
  }
  return (
    <Shell signedIn>
      <FamilyBoard />
    </Shell>
  );
}
