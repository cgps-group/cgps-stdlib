import { ApiError } from "next/dist/server/api-utils";

async function getUserFromAccessToken(req, res, adapter) {
  const accessToken = req?.headers?.["access-token"] ?? req?.query?.["access-token"];

  if (accessToken) {
    const { decode } = require("next-auth/jwt");
    const getConfig = require("next/config").default;
    const { serverRuntimeConfig } = getConfig();

    try {
      const user = await decode({
        secret: serverRuntimeConfig.auth.secret,
        token: accessToken,
        maxAge: 5 * 365 * 24 * 60 * 60, // 1825 days
      });
      const userId = user.id;
      const userDoc = await adapter.getUser(userId);
      return userDoc || undefined;
    }
    catch (err) {
      if (err?.code === "ERR_JWS_VERIFICATION_FAILED") {
        throw new ApiError(403, "Forbidden");
      }
      else {
        throw err;
      }
    }
  }

  return undefined;
}

export default getUserFromAccessToken;
