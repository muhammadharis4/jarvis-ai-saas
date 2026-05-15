/**
 * OpenAI Images API (DALL·E-style). Expects `prompt`, `amount`, `resolution` from the client form.
 */
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { getOpenAI } from "@/lib/ai-clients";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const openai = getOpenAI();
    if (!openai) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const nRaw = typeof amount === "string" ? parseInt(amount, 10) : Number(amount);
    if (!Number.isFinite(nRaw) || nRaw < 1 || nRaw > 10) {
      return new NextResponse("Amount must be a number from 1 to 10", { status: 400 });
    }
    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    const response = await openai.images.generate({
      prompt,
      n: nRaw,
      size: resolution,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("[API_IMAGE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
