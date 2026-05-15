import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("./prismadb", () => ({
  __esModule: true,
  default: {
    userApiLimit: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const { auth } = require("@clerk/nextjs") as { auth: jest.Mock };

const prismadb = require("./prismadb").default as {
  userApiLimit: {
    findUnique: jest.Mock;
    update: jest.Mock;
    create: jest.Mock;
  };
};

const { MAX_FREE_COUNTS } = require("@/constants") as {
  MAX_FREE_COUNTS: number;
};

const {
  checkApiLimit,
  getApiLimitCount,
  incrementApiLimit,
} = require("./api-limit") as {
  checkApiLimit: typeof import("./api-limit").checkApiLimit;
  getApiLimitCount: typeof import("./api-limit").getApiLimitCount;
  incrementApiLimit: typeof import("./api-limit").incrementApiLimit;
};

const authMock = auth;
const findUnique = prismadb.userApiLimit.findUnique;
const update = prismadb.userApiLimit.update;
const create = prismadb.userApiLimit.create;

describe("api-limit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkApiLimit", () => {
    it("returns false when user is not signed in", async () => {
      authMock.mockReturnValue({ userId: null });
      expect(await checkApiLimit()).toBe(false);
    });

    it("returns true when there is no usage row yet", async () => {
      authMock.mockReturnValue({ userId: "user_1" });
      findUnique.mockResolvedValue(null);
      expect(await checkApiLimit()).toBe(true);
    });

    it("returns true when count is below the free cap", async () => {
      authMock.mockReturnValue({ userId: "user_1" });
      findUnique.mockResolvedValue({
        id: "1",
        userId: "user_1",
        count: MAX_FREE_COUNTS - 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(await checkApiLimit()).toBe(true);
    });

    it("returns false when count reached the free cap", async () => {
      authMock.mockReturnValue({ userId: "user_1" });
      findUnique.mockResolvedValue({
        id: "1",
        userId: "user_1",
        count: MAX_FREE_COUNTS,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(await checkApiLimit()).toBe(false);
    });
  });

  describe("getApiLimitCount", () => {
    it("returns 0 when user is not signed in", async () => {
      authMock.mockReturnValue({ userId: null });
      expect(await getApiLimitCount()).toBe(0);
    });

    it("returns stored count", async () => {
      authMock.mockReturnValue({ userId: "user_1" });
      findUnique.mockResolvedValue({
        id: "1",
        userId: "user_1",
        count: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(await getApiLimitCount()).toBe(3);
    });
  });

  describe("incrementApiLimit", () => {
    it("does nothing when user is not signed in", async () => {
      authMock.mockReturnValue({ userId: null });
      await incrementApiLimit();
      expect(findUnique).not.toHaveBeenCalled();
    });

    it("creates a row when none exists", async () => {
      authMock.mockReturnValue({ userId: "user_1" });
      findUnique.mockResolvedValue(null);
      await incrementApiLimit();
      expect(create).toHaveBeenCalledWith({
        data: { userId: "user_1", count: 1 },
      });
    });

    it("increments existing count", async () => {
      authMock.mockReturnValue({ userId: "user_1" });
      findUnique.mockResolvedValue({
        id: "1",
        userId: "user_1",
        count: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await incrementApiLimit();
      expect(update).toHaveBeenCalledWith({
        where: { userId: "user_1" },
        data: { count: 3 },
      });
    });
  });
});
