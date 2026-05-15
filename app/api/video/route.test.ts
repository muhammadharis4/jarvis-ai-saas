import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { auth } from "@clerk/nextjs";

import { mockReplicateRun } from "../../../test/mocks/replicate";
import { POST } from "./route";

const authMock = jest.mocked(auth);

describe("POST /api/video", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReplicateRun.mockResolvedValue(["https://example.com/video.mp4"]);
  });

  it("returns 401 when unauthenticated", async () => {
    authMock.mockReturnValue({ userId: null } as never);

    const req = new Request("http://localhost/api/video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "waves" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    expect(mockReplicateRun).not.toHaveBeenCalled();
  });

  it("returns 400 when prompt is missing", async () => {
    authMock.mockReturnValue({ userId: "user_1" } as never);

    const req = new Request("http://localhost/api/video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
