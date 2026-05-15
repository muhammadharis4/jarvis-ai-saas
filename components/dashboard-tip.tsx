"use client";

import { BookOpen } from "lucide-react";
import { useUser } from "@clerk/nextjs";

/**
 * Lightweight onboarding cue for local / self-hosted runs (no env detection client-side).
 */
export function DashboardTip() {
  const { user } = useUser();

  const first = user?.firstName || user?.username;

  return (
    <section className="mb-10 space-y-3">
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {first ? `Welcome back, ${first}` : "Welcome to your dashboard"}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base mt-1 max-w-xl mx-auto md:mx-0">
          Pick a tool below. Each action calls your authenticated API routes — configure{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">.env</code> per the root{" "}
          <span className="font-medium text-foreground">README</span>.
        </p>
      </div>
      <aside
        role="note"
        className="rounded-lg border bg-muted/40 px-4 py-3 flex flex-wrap items-start gap-3 text-sm text-muted-foreground"
      >
        <BookOpen className="h-4 w-4 shrink-0 mt-0.5 text-foreground/70" aria-hidden />
        <div className="space-y-1 min-w-0">
          <p className="font-medium text-foreground">Running locally?</p>
          <p className="leading-relaxed">
            Copy <span className="font-mono text-xs">.env.docker.example</span> to{" "}
            <span className="font-mono text-xs">.env</span>, add Clerk, OpenAI, and Replicate credentials,
            then run <span className="font-mono text-xs">npm run dev</span> or{" "}
            <span className="font-mono text-xs">docker compose up</span>.
          </p>
        </div>
      </aside>
    </section>
  );
}
