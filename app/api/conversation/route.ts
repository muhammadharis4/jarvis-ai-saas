/**
 * Authenticated chat completions (OpenAI). Used by `/conversation`.
 */
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { getOpenAI } from "@/lib/ai-clients";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const openai = getOpenAI();
    if (!openai) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.error("[API_CONVERSATION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
