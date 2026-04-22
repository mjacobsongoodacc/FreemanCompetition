import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg md:min-h-dvh md:flex-row">
      <div className="relative flex h-[180px] w-full flex-col items-center justify-center bg-sidebar-bg px-6 md:h-auto md:min-h-dvh md:w-1/2 md:justify-center">
        <div
          className="h-16 w-16 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #f4e0c8, var(--amber-deep))",
            boxShadow:
              "0 0 0 2px color-mix(in oklab, var(--amber) 25%, transparent)",
          }}
          aria-hidden
        />
        <p className="mt-4 font-display text-[32px] font-semibold text-text-1">
          Shepherd.
        </p>
        <p className="mt-2 text-center font-mono text-[11px] font-medium uppercase tracking-wide text-text-2">
          Personal disaster companion
        </p>
        <p className="absolute bottom-6 left-6 hidden font-mono text-[10px] uppercase tracking-wider text-text-3 md:block">
          Demo build · Tulane AI Challenge
        </p>
      </div>
      <div className="flex flex-1 flex-col bg-bg md:w-1/2">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 md:flex-row md:items-start md:justify-center md:gap-10 md:py-12">
          <div className="w-full max-w-md space-y-6">
            <h1 className="font-display text-xl font-semibold text-text-1">
              Demo access
            </h1>
            <p className="font-body text-sm leading-relaxed text-text-2">
              Sign-up is the same as sign-in for this build — one tap opens the
              full demo experience.
            </p>
            <Button asChild className="h-12 w-full">
              <Link href="/app">Open Shepherd</Link>
            </Button>
            <p className="text-center font-body text-sm text-text-2 md:text-left">
              <Link
                href="/sign-in"
                className="shepherd-link font-medium text-amber underline-offset-4 hover:underline"
              >
                Back to sign in
              </Link>
            </p>
          </div>
          <p className="mt-6 max-w-[240px] text-center font-mono text-[11px] text-text-3 md:mt-10 md:text-left">
            This is a demo build for Tulane AI Challenge 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
