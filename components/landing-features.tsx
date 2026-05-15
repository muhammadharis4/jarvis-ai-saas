"use client";

import { Code, ImageIcon, MessageSquare, Music, Sparkles, VideoIcon } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: MessageSquare,
    title: "Conversation",
    description: "Chat with a fast GPT-3.5-style assistant for everyday questions.",
  },
  {
    icon: Music,
    title: "Music",
    description: "Turn text prompts into audio using Replicate-hosted models.",
  },
  {
    icon: ImageIcon,
    title: "Images",
    description: "Generate images from prompts with size and quantity controls.",
  },
  {
    icon: VideoIcon,
    title: "Video",
    description: "Create short clips from descriptive prompts.",
  },
  {
    icon: Code,
    title: "Code",
    description: "Ask for snippets and explanations in focused markdown.",
  },
];

export function LandingFeatures() {
  return (
    <section className="px-6 md:px-10 pb-16 border-t border-white/5 pt-16">
      <div className="text-center mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300 border border-white/10">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" aria-hidden />
          All tools in one workspace
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Everything you need to ship with AI
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base font-light">
          Sign in once, then jump between chat, media, and code workflows from your dashboard —
          wired for Clerk auth and provider keys you control.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
        {features.map(({ icon: Icon, title, description }) => (
          <Card
            key={title}
            className="bg-[#192339] border-white/10 text-white shadow-lg shadow-black/20"
          >
            <CardHeader className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10">
                <Icon className="h-5 w-5 text-purple-300" aria-hidden />
              </div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="text-zinc-400 text-sm leading-relaxed">
                {description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
