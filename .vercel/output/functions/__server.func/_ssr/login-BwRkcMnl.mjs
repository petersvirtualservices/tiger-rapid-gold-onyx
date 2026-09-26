import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as SignInPanel, r as useCurrentUserState, t as Shell } from "./sign-in-panel-6Rztbhcr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BwRkcMnl.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-2xl bg-line" }) });
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		signedIn: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-pretty",
			children: "You are signed in."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "mt-4 inline-flex min-h-11 items-center rounded-xl bg-primary px-4 font-bold text-primary-fg",
			children: "Go to the list"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInPanel, { redirectHome: true }) });
}
//#endregion
export { Login as component };
