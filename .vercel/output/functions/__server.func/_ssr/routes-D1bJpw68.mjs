import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { i as authMiddleware, n as PHASES, r as SEED_TASKS, s as phaseHeading, t as ASSIGNEES } from "./catalog-CT2RNDWL.mjs";
import { a as Phone, c as Copy, i as Trash2, l as ClipboardCheck, n as Warehouse, s as Droplets, t as Wifi, u as Check } from "../_libs/lucide-react.mjs";
import { n as SignInPanel, r as useCurrentUserState, t as Shell } from "./sign-in-panel-6Rztbhcr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D1bJpw68.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
var getBoard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e43b2b3b017acb671001e4bbe51eabf3690b1566101243a051f611d1a2579820"));
var createHousehold = createServerFn({ method: "POST" }).validator((input) => {
	return { name: cleanText((input && typeof input === "object" ? input : {}).name, 80) };
}).middleware([authMiddleware]).handler(createSsrRpc("f69881ea703d72062fabb37b1460b8a2027b49c2ddde8d8c9376ab98562dea7d"));
var joinHousehold = createServerFn({ method: "POST" }).validator((input) => {
	const record = input && typeof input === "object" ? input : {};
	return { code: typeof record.code === "string" ? record.code.toUpperCase().replace(/[^A-Z0-9]/g, "") : "" };
}).middleware([authMiddleware]).handler(createSsrRpc("24bbad150a48f7b406163109c262512395a5b596767eeb6941e06362b3daa453"));
var leaveHousehold = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("1cd3c19aa35a11b7e64f8a332980de3228e9939827fb5bbe4d55b6f6b78f851c"));
var addTask = createServerFn({ method: "POST" }).validator((input) => {
	const record = input && typeof input === "object" ? input : {};
	return {
		title: cleanText(record.title, 180),
		detail: noteText(record.detail),
		phase: typeof record.phase === "string" ? record.phase : "",
		assignee: typeof record.assignee === "string" ? record.assignee : ""
	};
}).middleware([authMiddleware]).handler(createSsrRpc("49411b29e5af1eb45dcad538561f9b4b3119fa724ea3b574c1d68ddadfb79580"));
var updateTask = createServerFn({ method: "POST" }).validator((input) => {
	const record = input && typeof input === "object" ? input : {};
	const patch = { id: cleanText(record.id, 80) };
	if (typeof record.status === "string") patch.status = asStatus(record.status);
	if (typeof record.assignee === "string") patch.assignee = record.assignee;
	if (typeof record.note === "string") patch.note = noteText(record.note);
	if (typeof record.title === "string") patch.title = cleanText(record.title, 180);
	if (typeof record.detail === "string") patch.detail = noteText(record.detail);
	return patch;
}).middleware([authMiddleware]).handler(createSsrRpc("d2a61953d064366117bbe04745ef2274c76024a291de31056e0e613b9135574c"));
var deleteTask = createServerFn({ method: "POST" }).validator((input) => {
	return { id: cleanText((input && typeof input === "object" ? input : {}).id, 80) };
}).middleware([authMiddleware]).handler(createSsrRpc("723a682fa137937ffd0754fceb37da1d5cd5414746a82d038cc850aa043fb440"));
PHASES.map((phase) => phase.id);
var PIN_ICONS = {
	1: Wifi,
	2: Phone,
	3: Droplets,
	4: ClipboardCheck,
	5: Warehouse,
	6: Trash2
};
function errorText(error) {
	if (error instanceof Error && error.message) {
		if (error.message === "Unauthorized") return "Please sign in again.";
		return error.message;
	}
	return "Something went wrong. Please try again.";
}
function matches(task, view, phase, query) {
	if (phase !== "all" && task.phase !== phase) return false;
	if (query) {
		if (!`${task.title} ${task.detail} ${task.note} ${task.assignee}`.toLowerCase().includes(query.toLowerCase())) return false;
	}
	if (view === "open") return task.status === "open";
	if (view === "done") return task.status === "done";
	if (view === "skipped") return task.status === "skipped";
	return true;
}
function PreviewList() {
	const pinned = SEED_TASKS.filter((task) => task.pinned).sort((a, b) => a.pinOrder - b.pinOrder);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-semibold",
				children: "Already on the list"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-pretty text-muted",
				children: "These are the ones you named. A full move out of a fifty-year house is under them, from the deed folder to the last meter reading."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-3",
				children: pinned.map((task) => {
					const Icon = PIN_ICONS[task.pinOrder] ?? ClipboardCheck;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-2xl border border-line bg-surface p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-5",
									"aria-hidden": "true"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold",
								children: task.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-pretty text-muted",
								children: task.detail
							})] })]
						})
					}, task.title);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col gap-1 text-muted",
				children: PHASES.map((phase) => {
					const count = SEED_TASKS.filter((task) => task.phase === phase.id && !task.pinned).length;
					if (!count) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						phase.heading,
						" · ",
						count,
						" more"
					] }, phase.id);
				})
			})
		]
	});
}
function GuestHome() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInPanel, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewList, {})]
	});
}
function LoadingList() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-2xl bg-line" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-2xl bg-line" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-2xl bg-line" })
		]
	});
}
function Lobby({ busy, error, onStart, onJoin }) {
	const [listName, setListName] = (0, import_react.useState)("Leaving the house");
	const [joining, setJoining] = (0, import_react.useState)(false);
	const [code, setCode] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-2xl border border-line bg-surface p-4 sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-semibold",
					children: "Start the family list"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-pretty text-muted",
					children: "This puts the moving list on one page. You will get a short code. Mom and Dad sign in, enter that code, and see the same checks and notes."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-4 flex flex-col gap-1 font-bold",
					children: ["Name for this list", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: listName,
						onChange: (event) => setListName(event.target.value),
						className: "min-h-11 rounded-xl border border-line bg-bg px-3 font-normal"
					})]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "mt-3 text-accent",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					className: "mt-4 min-h-11 w-full rounded-xl bg-primary px-4 font-bold text-primary-fg disabled:cursor-wait disabled:opacity-70",
					onClick: () => onStart(listName),
					children: busy ? "Starting…" : "Start our shared list"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-2 min-h-11 w-full rounded-xl border border-line px-4 font-bold",
					onClick: () => setJoining((open) => !open),
					children: "I have a family code"
				}),
				joining ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-3 flex flex-col gap-3",
					onSubmit: (event) => {
						event.preventDefault();
						onJoin(code);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-bold",
						children: ["Family code", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: code,
							onChange: (event) => setCode(event.target.value.toUpperCase()),
							autoCapitalize: "characters",
							autoCorrect: "off",
							spellCheck: false,
							maxLength: 11,
							className: "min-h-12 rounded-xl border border-line bg-bg px-3 text-center font-display text-2xl tracking-widest uppercase"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy,
						className: "min-h-11 rounded-xl bg-primary px-4 font-bold text-primary-fg disabled:opacity-70",
						children: "Join the list"
					})]
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewList, {})]
	});
}
function TaskCard({ task, busy, onStatus, onAssignee, onNote, onEdit, onDelete }) {
	const [noteOpen, setNoteOpen] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)(task.note);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)(task.title);
	const [detail, setDetail] = (0, import_react.useState)(task.detail);
	const [confirmRemove, setConfirmRemove] = (0, import_react.useState)(false);
	const done = task.status === "done";
	const skipped = task.status === "skipped";
	const Icon = task.pinned ? PIN_ICONS[task.pinOrder] : void 0;
	(0, import_react.useEffect)(() => {
		if (!noteOpen) setNote(task.note);
	}, [task.note, noteOpen]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "rounded-2xl border border-line bg-surface p-4 shadow-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": done,
				"aria-label": done ? `Mark not done: ${task.title}` : `Mark done: ${task.title}`,
				disabled: busy || skipped,
				className: "grid size-11 shrink-0 place-items-center",
				onClick: () => onStatus(done ? "open" : "done"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: done ? "grid size-7 place-items-center rounded-md border-2 border-primary bg-primary text-primary-fg" : "grid size-7 place-items-center rounded-md border-2 border-primary bg-surface",
					children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
						className: "size-4",
						"aria-hidden": "true"
					}) : null
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							Icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-4 text-accent",
								"aria-hidden": "true"
							}) : null,
							task.pinned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold tracking-wide text-accent uppercase",
								children: "You asked for this"
							}) : null,
							skipped ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold tracking-wide text-muted uppercase",
								children: "Not for us"
							}) : null
						]
					}),
					editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-2 flex flex-col gap-2",
						onSubmit: (event) => {
							event.preventDefault();
							onEdit(title, detail);
							setEditing(false);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1 font-bold",
								children: ["Task", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: title,
									onChange: (event) => setTitle(event.target.value),
									className: "min-h-11 rounded-xl border border-line bg-bg px-3 font-normal"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1 font-bold",
								children: ["Detail", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: detail,
									onChange: (event) => setDetail(event.target.value),
									rows: 4,
									className: "rounded-xl border border-line bg-bg px-3 py-2 font-normal"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "min-h-11 rounded-xl bg-primary px-4 font-bold text-primary-fg",
									children: "Save changes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11 rounded-xl border border-line px-4 font-bold",
									onClick: () => {
										setTitle(task.title);
										setDetail(task.detail);
										setEditing(false);
									},
									children: "Cancel"
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: done ? "font-bold text-muted line-through" : "font-bold",
						children: task.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-pretty text-muted",
						children: task.detail
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 items-center gap-2 font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "Who"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: ASSIGNEES.includes(task.assignee) ? task.assignee : "Anyone",
								onChange: (event) => onAssignee(event.target.value),
								disabled: busy,
								className: "min-h-11 rounded-xl border border-line bg-bg px-2 font-normal",
								children: ASSIGNEES.map((assignee) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: assignee,
									children: assignee
								}, assignee))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: ["Added by ", task.addedByName]
						})]
					}),
					task.note && !noteOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 rounded-xl bg-accent-soft px-3 py-2 text-pretty text-ink",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold",
							children: task.noteByName ? `${task.noteByName}: ` : "Note: "
						}), task.note]
					}) : null,
					noteOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3 flex flex-col gap-2",
						onSubmit: (event) => {
							event.preventDefault();
							onNote(note);
							setNoteOpen(false);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-1 font-bold",
							children: ["Note for the family", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: note,
								onChange: (event) => setNote(event.target.value),
								rows: 3,
								className: "rounded-xl border border-line bg-bg px-3 py-2 font-normal",
								placeholder: "Account number, appointment date, what they told you on the phone"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "min-h-11 rounded-xl bg-primary px-4 font-bold text-primary-fg",
								children: "Save note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 rounded-xl border border-line px-4 font-bold",
								onClick: () => {
									setNote(task.note);
									setNoteOpen(false);
								},
								children: "Cancel"
							})]
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							!noteOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 rounded-xl border border-line px-3 font-bold",
								onClick: () => setNoteOpen(true),
								children: task.note ? "Edit note" : "Add a note"
							}) : null,
							!editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 rounded-xl border border-line px-3 font-bold",
								onClick: () => setEditing(true),
								children: "Edit"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 rounded-xl border border-line px-3 font-bold",
								onClick: () => onStatus(skipped ? "open" : "skipped"),
								disabled: busy,
								children: skipped ? "Put back on the list" : "Not for us"
							}),
							confirmRemove ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 rounded-xl bg-accent px-3 font-bold text-primary-fg",
								onClick: onDelete,
								children: "Yes, remove"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 rounded-xl border border-line px-3 font-bold",
								onClick: () => setConfirmRemove(false),
								children: "Keep it"
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 rounded-xl px-3 font-bold text-muted",
								onClick: () => setConfirmRemove(true),
								children: "Remove"
							})
						]
					})
				]
			})]
		})
	});
}
function Board({ board, error, onCommit }) {
	const household = board.household;
	const [view, setView] = (0, import_react.useState)("open");
	const [phase, setPhase] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [detail, setDetail] = (0, import_react.useState)("");
	const [newPhase, setNewPhase] = (0, import_react.useState)("utilities");
	const [assignee, setAssignee] = (0, import_react.useState)("Anyone");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [leaveAsk, setLeaveAsk] = (0, import_react.useState)(false);
	if (!household) return null;
	const openCount = board.tasks.filter((task) => task.status === "open").length;
	const doneCount = board.tasks.filter((task) => task.status === "done").length;
	const skippedCount = board.tasks.filter((task) => task.status === "skipped").length;
	const actionable = openCount + doneCount;
	const percent = actionable === 0 ? 0 : Math.round(doneCount / actionable * 100);
	const shown = (task) => matches(task, view, phase, query.trim());
	const pinned = board.tasks.filter((task) => task.pinned && shown(task));
	const code = household.joinCode;
	const prettyCode = `${code.slice(0, 3)} ${code.slice(3)}`;
	async function commit(run) {
		setBusy(true);
		const ok = await onCommit(run);
		setBusy(false);
		return ok;
	}
	async function onAdd(event) {
		event.preventDefault();
		if (await commit(() => addTask({ data: {
			title,
			detail,
			phase: newPhase,
			assignee
		} }))) {
			setTitle("");
			setDetail("");
			setAdding(false);
			setView("all");
			setPhase("all");
			setQuery("");
		}
	}
	const views = [
		{
			id: "open",
			label: "Still to do",
			count: openCount
		},
		{
			id: "all",
			label: "Everything",
			count: board.tasks.length
		},
		{
			id: "done",
			label: "Finished",
			count: doneCount
		},
		{
			id: "skipped",
			label: "Set aside",
			count: skippedCount
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-line bg-surface p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl font-semibold",
						children: household.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 tabular-nums text-muted",
						children: [
							doneCount,
							" finished · ",
							openCount,
							" still to do",
							skippedCount ? ` · ${skippedCount} set aside` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "meter mt-3",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${percent}%` } })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "sr-only",
						children: [percent, " percent of the remaining work is finished."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold tracking-wide text-muted uppercase",
							children: "Family code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl tracking-widest",
							children: prettyCode
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3 font-bold",
							onClick: () => {
								navigator.clipboard.writeText(code).then(() => {
									setCopied(true);
									window.setTimeout(() => setCopied(false), 2e3);
								}, () => setCopied(false));
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
								className: "size-4",
								"aria-hidden": "true"
							}), copied ? "Copied" : "Copy code"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-pretty text-muted",
						children: "Give this code only to Mom and Dad. They sign in, choose “I have a family code,” and type it. Checks and notes then show up here on their screens too."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-muted",
						children: ["On this list: ", household.members.map((member) => member.displayName).join(", ")]
					})
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "rounded-xl bg-accent-soft px-3 py-2 text-accent",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-bold",
						children: ["Find a task", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (event) => setQuery(event.target.value),
							className: "min-h-11 rounded-xl border border-line bg-surface px-3 font-normal",
							placeholder: "Trash, T-Mobile, locker…"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: views.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-pressed": view === item.id,
							className: view === item.id ? "min-h-11 rounded-full bg-primary px-4 font-bold text-primary-fg" : "min-h-11 rounded-full border border-line bg-surface px-4 font-bold",
							onClick: () => setView(item.id),
							children: [
								item.label,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: item.count
								})
							]
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
							active: phase === "all",
							onClick: () => setPhase("all"),
							children: "All areas"
						}), PHASES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
							active: phase === item.id,
							onClick: () => setPhase(item.id),
							children: item.label
						}, item.id))]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-2xl border border-dashed border-line bg-surface p-4",
				children: adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex flex-col gap-3",
					onSubmit: onAdd,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-semibold",
							children: "Add something"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-1 font-bold",
							children: ["What needs doing", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: title,
								onChange: (event) => setTitle(event.target.value),
								className: "min-h-11 rounded-xl border border-line bg-bg px-3 font-normal",
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-1 font-bold",
							children: ["Detail, if it helps", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: detail,
								onChange: (event) => setDetail(event.target.value),
								rows: 3,
								className: "rounded-xl border border-line bg-bg px-3 py-2 font-normal"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1 font-bold",
								children: ["Which part of the move", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: newPhase,
									onChange: (event) => setNewPhase(event.target.value),
									className: "min-h-11 rounded-xl border border-line bg-bg px-2 font-normal",
									children: PHASES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: item.id,
										children: item.label
									}, item.id))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1 font-bold",
								children: ["Who should do it", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: assignee,
									onChange: (event) => setAssignee(event.target.value),
									className: "min-h-11 rounded-xl border border-line bg-bg px-2 font-normal",
									children: ASSIGNEES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: item,
										children: item
									}, item))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: busy,
								className: "min-h-11 rounded-xl bg-primary px-4 font-bold text-primary-fg disabled:opacity-70",
								children: "Add to the list"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 rounded-xl border border-line px-4 font-bold",
								onClick: () => setAdding(false),
								children: "Cancel"
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 w-full rounded-xl bg-primary px-4 font-bold text-primary-fg",
					onClick: () => {
						setNewPhase(phase === "all" ? "utilities" : phase);
						setAdding(true);
					},
					children: "Add something we still need to do"
				})
			}),
			pinned.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "start-here",
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-semibold",
					children: "Start here"
				}), pinned.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskCard, {
					task,
					busy,
					onStatus: (status) => void commit(() => updateTask({ data: {
						id: task.id,
						status
					} })),
					onAssignee: (next) => void commit(() => updateTask({ data: {
						id: task.id,
						assignee: next
					} })),
					onNote: (note) => void commit(() => updateTask({ data: {
						id: task.id,
						note
					} })),
					onEdit: (nextTitle, nextDetail) => void commit(() => updateTask({ data: {
						id: task.id,
						title: nextTitle,
						detail: nextDetail
					} })),
					onDelete: () => void commit(() => deleteTask({ data: { id: task.id } }))
				}, task.id))]
			}) : null,
			PHASES.map((item) => {
				const tasks = board.tasks.filter((task) => !task.pinned && task.phase === item.id && shown(task));
				if (!tasks.length) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					id: `phase-${item.id}`,
					className: "flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold",
						children: phaseHeading(item.id)
					}), tasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskCard, {
						task,
						busy,
						onStatus: (status) => void commit(() => updateTask({ data: {
							id: task.id,
							status
						} })),
						onAssignee: (next) => void commit(() => updateTask({ data: {
							id: task.id,
							assignee: next
						} })),
						onNote: (note) => void commit(() => updateTask({ data: {
							id: task.id,
							note
						} })),
						onEdit: (nextTitle, nextDetail) => void commit(() => updateTask({ data: {
							id: task.id,
							title: nextTitle,
							detail: nextDetail
						} })),
						onDelete: () => void commit(() => deleteTask({ data: { id: task.id } }))
					}, task.id))]
				}, item.id);
			}),
			!pinned.length && !board.tasks.some((task) => !task.pinned && shown(task)) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-pretty text-muted",
				children: "Nothing in this view. Try “Still to do,” or add a task of your own."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-line pt-4",
				children: leaveAsk ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-pretty",
						children: "Leave this list? If you are the last person on it, the list is deleted."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-h-11 rounded-xl bg-accent px-4 font-bold text-primary-fg",
							onClick: () => void commit(() => leaveHousehold()),
							children: "Leave the list"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-h-11 rounded-xl border border-line px-4 font-bold",
							onClick: () => setLeaveAsk(false),
							children: "Stay"
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 font-bold text-muted underline-offset-4 hover:underline",
					onClick: () => setLeaveAsk(true),
					children: "Leave this list"
				})
			})
		]
	});
}
function FilterChip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": active,
		onClick,
		className: active ? "min-h-11 rounded-full bg-primary-soft px-3 font-bold text-primary" : "min-h-11 rounded-full border border-line bg-surface px-3 font-bold text-ink",
		children
	});
}
function FamilyBoard() {
	const [board, setBoard] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const epoch = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
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
		refresh();
		const timer = window.setInterval(() => {
			refresh();
		}, 1e4);
		return () => {
			cancel = true;
			window.clearInterval(timer);
		};
	}, []);
	async function commit(run) {
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
	if (loading && !board) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingList, {});
	if (!board) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "alert",
			children: error ?? "The list could not be loaded."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "min-h-11 w-fit rounded-xl bg-primary px-4 font-bold text-primary-fg",
			onClick: () => window.location.reload(),
			children: "Try again"
		})]
	});
	if (!board.household) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lobby, {
		busy,
		error,
		onStart: (name) => {
			setBusy(true);
			commit(() => createHousehold({ data: { name } })).finally(() => setBusy(false));
		},
		onJoin: (code) => {
			setBusy(true);
			commit(() => joinHousehold({ data: { code } })).finally(() => setBusy(false));
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, {
		board,
		error,
		onCommit: commit
	});
}
function MoveApp() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingList, {}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestHome, {}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		signedIn: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FamilyBoard, {})
	});
}
var SplitComponent = MoveApp;
//#endregion
export { SplitComponent as component };
