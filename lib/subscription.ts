import { auth } from "@clerk/nextjs";

import prismadb from "./prismadb";

/** Extra day after `stripeCurrentPeriodEnd` so brief clock skew or webhook delay does not drop access immediately. */
const GRACE_MS = 86_400_000;

/**
 * Returns true when the user has an active-looking Stripe subscription row.
 * Populated by your billing integration (e.g. webhooks); not validated against Stripe live here.
 */
export const checkSubscription = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const userSubscription = await prismadb.userSubscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!userSubscription) {
    return false;
  }

  const periodEndMs = userSubscription.stripeCurrentPeriodEnd?.getTime();
  const isValid =
    Boolean(userSubscription.stripePriceId) &&
    periodEndMs != null &&
    periodEndMs + GRACE_MS > Date.now();

  return isValid;
};
