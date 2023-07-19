import serverRuntimeConfig from "../../config/server-runtime-config.js";

// if (typeof serverRuntimeConfig.auth.adapter !== "object") {
//   throw new Error("auth requires an adapter");
// }

console.log(
  serverRuntimeConfig.auth.adapter
)

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

function createPrismaAdapter() {
  const prisma = new PrismaClient();
  return PrismaAdapter(prisma); // eslint-disable-line new-cap
}

export default createPrismaAdapter();
