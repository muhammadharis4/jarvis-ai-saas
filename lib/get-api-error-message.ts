import { isAxiosError } from "axios";

/**
 * Maps failed API calls into a short client-facing string (toast / inline).
 * Server routes often respond with plain `NextResponse("message", { status })`.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong.",
): string {
  if (!isAxiosError(error)) {
    return fallback;
  }

  const status = error.response?.status;
  const raw = error.response?.data;

  if (typeof raw === "string" && raw.trim().length > 0) {
    return raw.trim();
  }

  if (status === 401) return "You need to be signed in.";
  if (status === 429) return "Too many requests. Try again in a moment.";
  if (status === 500) {
    return "Server error — confirm API keys in .env and check the terminal logs.";
  }

  return fallback;
}
