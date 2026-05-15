import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { auth } from "@clerk/nextjs";

import { mockChatCompletionsCreate } from "../../../test/mocks/openai";
import { POST } from "./route";

const authMock = jest.mocked(auth);

describe("POST /api/code", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockChatCompletionsCreate.mockResolvedValue({
      choices: [
        { message: { role: "assistant", content: "```ts\nconst x = 1\n```" } },
      ],
    });
  });

  it("returns 401 when unauthenticated", async () => {
    authMock.mockReturnValue({ userId: null } as never);

    const req = new Request("http://localhost/api/code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Write hello" }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("prepends system instruction to messages", async () => {
    authMock.mockReturnValue({ userId: "user_1" } as never);

    const req = new Request("http://localhost/api/code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hi" }],
      }),
    });

    await POST(req);

    expect(mockChatCompletionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gpt-3.5-turbo",
        messages: expect.arrayContaining([
          expect.objectContaining({ role: "system" }),
          { role: "user", content: "Hi" },
        ]),
      }),
    );
    const call = mockChatCompletionsCreate.mock.calls[0][0] as {
      messages: { role: string; content?: string }[];
    };
    expect(call.messages[0].role).toBe("system");
    expect(call.messages[1]).toEqual({ role: "user", content: "Hi" });
  });
});
