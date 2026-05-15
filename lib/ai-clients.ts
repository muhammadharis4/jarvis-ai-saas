import OpenAI from "openai";
import Replicate from "replicate";

/**
 * Server-only lazy clients. OpenAI/Replicate constructors validate env at
 * instantiation time, so we defer creation until a request handler runs — this
 * keeps `next build` from failing when keys are unset in the build environment.
 */
let openaiSingleton: OpenAI | null = null;
let replicateSingleton: Replicate | null = null;

export function getOpenAI(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  if (!openaiSingleton) {
    openaiSingleton = new OpenAI({ apiKey: key });
  }
  return openaiSingleton;
}

export function getReplicate(): Replicate | null {
  const token = process.env.REPLICATE_API_KEY?.trim();
  if (!token) return null;
  if (!replicateSingleton) {
    replicateSingleton = new Replicate({ auth: token });
  }
  return replicateSingleton;
}
