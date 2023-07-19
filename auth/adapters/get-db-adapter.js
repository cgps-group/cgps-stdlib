import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

function createPrismaAdapter() {
  const prisma = new PrismaClient();
  return PrismaAdapter(prisma); // eslint-disable-line new-cap
}

export default createPrismaAdapter();
