import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("./prismadb", () => ({
  __esModule: true,
  default: {
    userSubscription: {
      findUnique: jest.fn(),
    },
  },
}));

const { auth } = require("@clerk/nextjs") as { auth: jest.Mock };

const prismadb = require("./prismadb").default as {
  userSubscription: { findUnique: jest.Mock };
};

const { checkSubscription } = require("./subscription") as {
  checkSubscription: typeof import("./subscription").checkSubscription;
};

const authMock = auth;
const findUnique = prismadb.userSubscription.findUnique;

describe("checkSubscription", () => {
  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns false when there is no signed-in user", async () => {
    authMock.mockReturnValue({ userId: null });
    expect(await checkSubscription()).toBe(false);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("returns false when no subscription row exists", async () => {
    authMock.mockReturnValue({ userId: "user_1" });
    findUnique.mockResolvedValue(null);
    expect(await checkSubscription()).toBe(false);
  });

  it("returns false when stripePriceId is missing", async () => {
    authMock.mockReturnValue({ userId: "user_1" });
    findUnique.mockResolvedValue({
      stripeSubscriptionId: "sub_1",
      stripeCustomerId: "cus_1",
      stripePriceId: null,
      stripeCurrentPeriodEnd: new Date(Date.now() + 86_400_000),
    });
    expect(await checkSubscription()).toBe(false);
  });

  it("returns false when period end plus grace is not after now", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-06-15T12:00:00.000Z"));

    authMock.mockReturnValue({ userId: "user_1" });
    const stripeCurrentPeriodEnd = new Date("2024-06-13T12:00:00.000Z");
    findUnique.mockResolvedValue({
      stripeSubscriptionId: "sub_1",
      stripeCustomerId: "cus_1",
      stripePriceId: "price_1",
      stripeCurrentPeriodEnd,
    });

    expect(await checkSubscription()).toBe(false);
  });

  it("returns true within one day after current period end", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-06-15T12:00:00.000Z"));

    authMock.mockReturnValue({ userId: "user_1" });
    const stripeCurrentPeriodEnd = new Date("2024-06-15T11:00:00.000Z");
    findUnique.mockResolvedValue({
      stripeSubscriptionId: "sub_1",
      stripeCustomerId: "cus_1",
      stripePriceId: "price_1",
      stripeCurrentPeriodEnd,
    });

    expect(await checkSubscription()).toBe(true);
  });
});
