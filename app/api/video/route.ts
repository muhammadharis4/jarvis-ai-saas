/**
 * Short video generation via Replicate (Zeroscope). Requires `REPLICATE_API_KEY`.
 */
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { getReplicate } from "@/lib/ai-clients";

const ZEROSCOPE_MODEL =
  "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351";

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

    const response = await replicate.run(ZEROSCOPE_MODEL, {
      input: {
        prompt,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("[API_VIDEO]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
