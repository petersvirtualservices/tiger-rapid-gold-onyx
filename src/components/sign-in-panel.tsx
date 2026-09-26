import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, signIn } from "@/lib/auth/client";

type Mode = "create" | "enter";

function messageOf(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  if (error instanceof Error && error.message) return error.message;
  return "That did not work. Please try again.";
}

export function SignInPanel({ redirectHome = false }: { redirectHome?: boolean }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("create");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
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
      const result =
        mode === "create"
          ? await authClient.signUp.email({
              name: name.trim(),
              email: email.trim(),
              password,
              callbackURL: "/",
            })
          : await authClient.signIn.email({
              email: email.trim(),
              password,
              callbackURL: "/",
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

  return (
    <section className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-5">
      <h2 className="font-display text-2xl font-semibold text-ink">Sign in to share the list</h2>
      <p className="mt-2 text-pretty text-muted">
        Each person signs in once. After that, a checkmark or a note shows up for everyone.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        {GROK_PROVIDERS.map((provider) => (
          <button
            key={provider.providerId}
            type="button"
            className="min-h-11 rounded-xl border border-line bg-surface px-4 font-bold text-ink hover:bg-primary-soft"
            onClick={() => signIn(provider.providerId, { callbackURL: "/" })}
          >
            Continue with {provider.label}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm font-bold tracking-wide text-muted uppercase">Or use email</p>
      <form className="mt-3 flex flex-col gap-3" onSubmit={onSubmit}>
        {mode === "create" ? (
          <label className="flex flex-col gap-1 font-bold">
            Your name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              className="min-h-11 rounded-xl border border-line bg-bg px-3 font-normal text-ink"
            />
          </label>
        ) : null}
        <label className="flex flex-col gap-1 font-bold">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            inputMode="email"
            className="min-h-11 rounded-xl border border-line bg-bg px-3 font-normal text-ink"
          />
        </label>
        <label className="flex flex-col gap-1 font-bold">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === "create" ? "new-password" : "current-password"}
            className="min-h-11 rounded-xl border border-line bg-bg px-3 font-normal text-ink"
          />
        </label>
        {error ? (
          <p role="alert" className="text-pretty text-accent">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="min-h-11 rounded-xl bg-primary px-4 font-bold text-primary-fg disabled:cursor-wait disabled:opacity-70"
        >
          {busy ? "One moment…" : mode === "create" ? "Create account" : "Sign in"}
        </button>
      </form>
      <button
        type="button"
        className="mt-3 min-h-11 text-left font-bold text-primary underline-offset-4 hover:underline"
        onClick={() => {
          setMode(mode === "create" ? "enter" : "create");
          setError(null);
        }}
      >
        {mode === "create" ? "I already have an account" : "I need to create an account"}
      </button>
    </section>
  );
}
