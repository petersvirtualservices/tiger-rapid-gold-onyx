import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { SignInPanel } from "@/components/sign-in-panel";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <Shell>
        <div className="h-40 animate-pulse rounded-2xl bg-line" />
      </Shell>
    );
  }
  if (user) {
    return (
      <Shell signedIn>
        <p className="text-pretty">You are signed in.</p>
        <Link
          to="/"
          className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-primary px-4 font-bold text-primary-fg"
        >
          Go to the list
        </Link>
      </Shell>
    );
  }
  return (
    <Shell>
      <SignInPanel redirectHome />
    </Shell>
  );
}
