"use client";

import { Drawer, Divider } from "@mantine/core";
import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { user } from "@/lib/mock-data";

type SidebarDrawerProps = {
  opened: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
};

export function SidebarDrawer({
  opened,
  onClose,
  onOpenSettings,
}: SidebarDrawerProps) {
  const router = useRouter();

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="left"
      size={280}
      withCloseButton={false}
      overlayProps={{ backgroundOpacity: 0.6 }}
      transitionProps={{ duration: 250 }}
      styles={{
        content: {
          background: "var(--sidebar-bg)",
        },
        body: {
          padding: 24,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber">
            <span className="font-body text-2xl font-semibold text-white">
              SB
            </span>
          </div>
          <p className="mt-4 font-display text-xl font-semibold text-text-1">
            {user.name}
          </p>
          <p className="mt-1 font-mono text-[11px] font-medium uppercase tracking-wide text-text-2">
            Gentilly · 70122
          </p>
          <Divider my="lg" color="var(--border)" />
          <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-text-3">
            Profile
          </p>
          <div className="mt-3 space-y-4">
            <div>
              <p className="font-mono text-[10px] uppercase text-text-3">
                Address
              </p>
              <p className="mt-1 font-body text-sm text-text-1">
                {user.address}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase text-text-3">
                Vehicle
              </p>
              <p className="mt-1 font-body text-sm text-text-1">
                {user.vehicle}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase text-text-3">
                Insurance
              </p>
              <p className="mt-1 font-body text-sm text-text-1">
                {user.insuranceNotes}
              </p>
            </div>
          </div>
        </div>
        <Divider my="lg" color="var(--border)" />
        <div className="flex flex-col gap-2 pb-safe">
          <Button
            variant="ghost"
            className="h-12 w-full justify-start gap-2 text-amber"
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
          >
            <Settings size={18} />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="h-12 w-full justify-start gap-2 text-text-2"
            onClick={() => {
              onClose();
              router.push("/");
            }}
          >
            <LogOut size={18} />
            Sign out
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
