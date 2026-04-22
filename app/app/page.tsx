"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CompanionChat } from "@/components/app/companion-chat";
import { MonitorPanel } from "@/components/app/monitor-panel";
import { useStorm } from "@/lib/storm-context";

export default function AppHome() {
  const { activeTab } = useStorm();

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {activeTab === "companion" ? (
          <motion.div
            key="companion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <CompanionChat />
          </motion.div>
        ) : (
          <motion.div
            key="monitor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <MonitorPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
