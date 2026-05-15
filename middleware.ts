import { authMiddleware } from "@clerk/nextjs";

/**
 * Clerk session gate. Only `/` is public; everything else (including `/api/*`)
 * requires a signed-in user unless you add routes to `publicRoutes`.
 */
export default authMiddleware({
  publicRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
