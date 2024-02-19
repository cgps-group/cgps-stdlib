import { encode } from "next-auth/jwt";

import serverRuntimeConfig from "../config/server-runtime-config.js";

import requireUserMiddleware from "./require-user.js";

async function createAccessToken(req, res, adapter) {
  const user = await requireUserMiddleware(req, res, adapter);

  const accessToken = await encode({
    token: { id: user.id },
    secret: serverRuntimeConfig.auth.secret,
    maxAge: 5 * 365 * 24 * 60 * 60, // 1825 days
  });

  return accessToken;
}

export default createAccessToken;
