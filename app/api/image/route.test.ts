import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { auth } from "@clerk/nextjs";

import { mockImagesGenerate } from "../../../test/mocks/openai";
import { POST } from "./route";

const authMock = jest.mocked(auth);

describe("POST /api/image", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockImagesGenerate.mockResolvedValue({
      data: [{ url: "https://example.com/x.png" }],
    });
  });

  it("returns 401 when unauthenticated", async () => {
    authMock.mockReturnValue({ userId: null } as never);

    const req = new Request("http://localhost/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "a cat",
        amount: 1,
        resolution: "512x512",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    expect(mockImagesGenerate).not.toHaveBeenCalled();
  });

  it("returns 400 when prompt is missing", async () => {
    authMock.mockReturnValue({ userId: "user_1" } as never);

    const req = new Request("http://localhost/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1, resolution: "512x512" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("calls images.generate with prompt and size", async () => {
    authMock.mockReturnValue({ userId: "user_1" } as never);

    const req = new Request("http://localhost/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "sunset",
        amount: "2",
        resolution: "512x512",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockImagesGenerate).toHaveBeenCalledWith({
      prompt: "sunset",
      n: 2,
      size: "512x512",
    });
    const json = await res.json();
    expect(json).toEqual([{ url: "https://example.com/x.png" }]);
  });
});
