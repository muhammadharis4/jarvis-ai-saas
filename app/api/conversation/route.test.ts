import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { auth } from "@clerk/nextjs";

import { mockChatCompletionsCreate } from "../../../test/mocks/openai";
import { POST } from "./route";

const authMock = jest.mocked(auth);

describe("POST /api/conversation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockChatCompletionsCreate.mockResolvedValue({
      choices: [{ message: { role: "assistant", content: "Hello" } }],
    });
  });

  it("returns 401 when unauthenticated", async () => {
    authMock.mockReturnValue({ userId: null } as never);

    const req = new Request("http://localhost/api/conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hi" }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    expect(mockChatCompletionsCreate).not.toHaveBeenCalled();
  });

  it("returns 400 when messages are missing", async () => {
    authMock.mockReturnValue({ userId: "user_1" } as never);

    const req = new Request("http://localhost/api/conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(mockChatCompletionsCreate).not.toHaveBeenCalled();
  });

  it("returns assistant message on success", async () => {
    authMock.mockReturnValue({ userId: "user_1" } as never);

    const req = new Request("http://localhost/api/conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hi" }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ role: "assistant", content: "Hello" });
    expect(mockChatCompletionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hi" }],
      }),
    );
  });
});
