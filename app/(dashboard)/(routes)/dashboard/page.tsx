"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { DashboardTip } from "@/components/dashboard-tip";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { tools } from "@/constants";

const HomePage = () => {
  const router = useRouter();

  return (
    <div>
      <DashboardTip />

      <div className="mb-6 space-y-1 text-center md:text-center">
        <h2 className="text-xl md:text-3xl font-bold">Explore your tools</h2>
        <p className="text-muted-foreground font-light text-sm md:text-base">
          Open a workspace — keyboard: focus a row and press Enter.
        </p>
      </div>

      <div className="px-4 md:px-16 lg:px-28 space-y-3">
        {tools.map((tool) => (
          <Card
            key={tool.href}
            tabIndex={0}
            role="button"
            aria-label={`Open ${tool.label}`}
            onClick={() => router.push(tool.href)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                router.push(tool.href);
              }
            }}
            className={cn(
              "p-4 border-black/5 flex items-center justify-between",
              "hover:shadow-md transition cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40",
            )}
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold text-left">{tool.label}</div>
            </div>
            <ArrowRight className="w-5 h-5 shrink-0" aria-hidden />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
