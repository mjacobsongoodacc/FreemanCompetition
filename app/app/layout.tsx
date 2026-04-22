"use client";

import { AppShell } from "@/components/app/app-shell";
import { StormProvider } from "@/lib/storm-context";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StormProvider>
      <AppShell>{children}</AppShell>
    </StormProvider>
  );
}
