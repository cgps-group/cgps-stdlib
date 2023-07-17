/* eslint-disable new-cap */

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

function createPrismaAdapter(prisma) {
  return PrismaAdapter(prisma ?? new PrismaClient());
}

export default createPrismaAdapter;
