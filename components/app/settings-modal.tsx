"use client";

import { Divider, Modal } from "@mantine/core";
import { Button } from "@/components/ui/button";
import { user as mockUser } from "@/lib/mock-data";
import { useStorm } from "@/lib/storm-context";

type SettingsModalProps = {
  opened: boolean;
  onClose: () => void;
};

export function SettingsModal({ opened, onClose }: SettingsModalProps) {
  const { stormActive, setStormActive, resetDemo } = useStorm();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Settings"
      size="md"
      centered
      styles={{
        title: {
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          color: "var(--text-1)",
        },
        content: {
          background: "var(--surface)",
          border: "1px solid var(--border)",
        },
        header: {
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        },
        body: {
          color: "var(--text-1)",
        },
      }}
    >
      <div className="space-y-4">
        <div>
          <p className="font-mono text-[10px] uppercase text-text-3">Name</p>
          <p className="mt-1 font-body text-sm text-text-1">{mockUser.name}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase text-text-3">Email</p>
          <p className="mt-1 font-body text-sm text-text-1">
            {mockUser.demoEmail}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase text-text-3">
            Location
          </p>
          <p className="mt-1 font-body text-sm text-text-1">
            Gentilly, New Orleans · 70122
          </p>
        </div>
        <Divider color="var(--border)" />
        <div>
          <p className="font-display text-base font-semibold text-text-1">
            Demo controls
          </p>
          <button
            type="button"
            onClick={() => setStormActive(!stormActive)}
            className="shepherd-focus shepherd-active mt-4 flex w-full items-center justify-between rounded-md border border-border bg-surface-2 px-3 py-3 text-left [@media(hover:hover)]:hover:bg-[color-mix(in_oklab,var(--amber)_6%,transparent)]"
          >
            <span className="font-body text-sm text-text-1">
              Storm simulation active
            </span>
            <span className="font-mono text-xs text-amber">
              {stormActive ? "On" : "Off"}
            </span>
          </button>
          <Button
            variant="outline"
            className="mt-3 h-10 w-full text-amber"
            type="button"
            onClick={resetDemo}
          >
            Reset demo
          </Button>
        </div>
      </div>
    </Modal>
  );
}
