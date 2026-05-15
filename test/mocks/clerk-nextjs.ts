import { jest } from "@jest/globals";

/** Jest-only stub so tests never load Clerk’s ESM `@clerk/backend` bundle. */
export const auth = jest.fn(() => ({ userId: null as string | null }));
