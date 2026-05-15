import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Single PrismaClient per Node process. In development, reuse across hot reloads
 * so dev servers do not spawn a new pool on every compile.
 */
const prismadb = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismadb;

export default prismadb;
