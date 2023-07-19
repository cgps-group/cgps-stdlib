import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

function createPrismaAdapter(prisma) {
  // eslint-disable-next-line new-cap
  return PrismaAdapter(prisma ?? new PrismaClient());
}

export default createPrismaAdapter;
