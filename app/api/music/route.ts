/**
 * Music via Replicate (Riffusion). Requires `REPLICATE_API_KEY`.
 */
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { getReplicate } from "@/lib/ai-clients";

const RIFFUSION_MODEL =
  "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const replicate = getReplicate();
    if (!replicate) {
      return new NextResponse("Replicate API key not configured.", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const response = await replicate.run(RIFFUSION_MODEL, {
      input: {
        prompt_a: prompt,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("[API_MUSIC]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
