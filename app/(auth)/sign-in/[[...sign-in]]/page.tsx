import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center bg-bg px-6 pb-20 pt-20 lg:pt-28">
      <div className="flex flex-col items-center">
        <div
          className="h-14 w-14 rounded-full lg:h-16 lg:w-16"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #f4e0c8, var(--amber-deep))",
            boxShadow:
              "0 0 0 2px color-mix(in oklab, var(--amber) 25%, transparent)",
          }}
          aria-hidden
        />
        <p className="mt-6 font-display text-3xl font-semibold text-text-1 lg:text-[32px]">
          Shepherd.
        </p>
        <p className="mt-2 text-center font-mono text-[11px] font-medium uppercase tracking-wide text-text-2">
          Personal disaster companion
        </p>
      </div>

      <div className="mt-20 w-full max-w-md space-y-6 lg:mt-28">
        <h1 className="font-display text-xl font-semibold text-text-1">
          Try the demo
        </h1>
        <p className="font-body text-sm leading-relaxed text-text-2">
          No account needed for the pitch build — jump straight into the
          companion and storm monitor.
        </p>
        <Button asChild className="h-12 w-full">
          <Link href="/app">Open Shepherd</Link>
        </Button>
        <p className="flex min-h-touch flex-col justify-center font-body text-sm leading-relaxed text-text-2">
          New here?{" "}
          <Link
            href="/sign-up"
            className="shepherd-link font-medium text-amber underline-offset-4 hover:underline"
          >
            Same demo entry
          </Link>
        </p>
      </div>

      <p className="absolute right-6 top-6 max-w-[240px] text-right font-mono text-[11px] text-text-3">
        This is a demo build for Tulane AI Challenge 2026.
      </p>
      <p className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-wider text-text-3">
        Demo build · Tulane AI Challenge
      </p>
    </div>
  );
}
