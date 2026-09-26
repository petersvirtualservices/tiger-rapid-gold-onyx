import type { ReactNode } from "react";
import { House } from "lucide-react";
import { UserButton } from "@/lib/auth/gates";

export function Shell({
  children,
  signedIn = false,
}: {
  children: ReactNode;
  signedIn?: boolean;
}) {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="bg-primary text-primary-fg">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-bold tracking-wide">Fifty years in one house</p>
            {signedIn ? (
              <div className="max-w-full [&_span]:max-w-40 [&_span]:truncate">
                <UserButton />
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <House className="size-8 shrink-0" aria-hidden="true" />
            <h1 className="font-display text-4xl leading-none font-semibold">Leaving Home</h1>
          </div>
          <p className="max-w-xl text-pretty">
            One shared list for Mom, Dad, and you, so moving out of this house does not depend on
            memory.
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
