import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as signOut, r as signIn, t as authClient } from "./client-1vAx-gM_.mjs";
import { a as hasGateSessionMarker, t as GROK_PROVIDERS } from "./server-CE9C_DXW.mjs";
import { o as House } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sign-in-panel-6Rztbhcr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function Shell({ children, signedIn = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "bg-primary text-primary-fg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold tracking-wide",
							children: "Fifty years in one house"
						}), signedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-w-full [&_span]:max-w-40 [&_span]:truncate",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, {
							className: "size-8 shrink-0",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl leading-none font-semibold",
							children: "Leaving Home"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xl text-pretty",
						children: "One shared list for Mom, Dad, and you, so moving out of this house does not depend on memory."
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto w-full max-w-3xl px-4 py-6 sm:px-6",
			children
		})]
	});
}
function messageOf(error) {
	if (error && typeof error === "object" && "message" in error) {
		const message = error.message;
		if (typeof message === "string" && message.trim()) return message;
	}
	if (error instanceof Error && error.message) return error.message;
	return "That did not work. Please try again.";
}
function SignInPanel({ redirectHome = false }) {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("create");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(event) {
		event.preventDefault();
		setError(null);
		if (mode === "create" && name.trim().length < 2) {
			setError("Add your name so the others can see who wrote a note.");
			return;
		}
		if (!email.includes("@") || password.length < 8) {
			setError("Use a real email and a password of at least 8 characters.");
			return;
		}
		setBusy(true);
		try {
			const result = mode === "create" ? await authClient.signUp.email({
				name: name.trim(),
				email: email.trim(),
				password,
				callbackURL: "/"
			}) : await authClient.signIn.email({
				email: email.trim(),
				password,
				callbackURL: "/"
			});
			if (result.error) {
				setError(messageOf(result.error));
				setBusy(false);
				return;
			}
			if (redirectHome) await navigate({ to: "/" });
		} catch (err) {
			setError(messageOf(err));
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-semibold text-ink",
				children: "Sign in to share the list"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-pretty text-muted",
				children: "Each person signs in once. After that, a checkmark or a note shows up for everyone."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-col gap-2",
				children: GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "min-h-11 rounded-xl border border-line bg-surface px-4 font-bold text-ink hover:bg-primary-soft",
					onClick: () => signIn(provider.providerId, { callbackURL: "/" }),
					children: ["Continue with ", provider.label]
				}, provider.providerId))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-bold tracking-wide text-muted uppercase",
				children: "Or use email"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 flex flex-col gap-3",
				onSubmit,
				children: [
					mode === "create" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-bold",
						children: ["Your name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (event) => setName(event.target.value),
							autoComplete: "name",
							className: "min-h-11 rounded-xl border border-line bg-bg px-3 font-normal text-ink"
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-bold",
						children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							value: email,
							onChange: (event) => setEmail(event.target.value),
							autoComplete: "email",
							inputMode: "email",
							className: "min-h-11 rounded-xl border border-line bg-bg px-3 font-normal text-ink"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 font-bold",
						children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							value: password,
							onChange: (event) => setPassword(event.target.value),
							autoComplete: mode === "create" ? "new-password" : "current-password",
							className: "min-h-11 rounded-xl border border-line bg-bg px-3 font-normal text-ink"
						})]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "text-pretty text-accent",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy,
						className: "min-h-11 rounded-xl bg-primary px-4 font-bold text-primary-fg disabled:cursor-wait disabled:opacity-70",
						children: busy ? "One moment…" : mode === "create" ? "Create account" : "Sign in"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-3 min-h-11 text-left font-bold text-primary underline-offset-4 hover:underline",
				onClick: () => {
					setMode(mode === "create" ? "enter" : "create");
					setError(null);
				},
				children: mode === "create" ? "I already have an account" : "I need to create an account"
			})
		]
	});
}
//#endregion
export { SignInPanel as n, useCurrentUserState as r, Shell as t };
