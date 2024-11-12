import { getServerSession } from "next-auth/next";

import createOptions from "../auth/create-options.js";

import getUserFromAccessToken from "./get-user-from-access-token.js";

async function getUserMiddleware(req, res, adapter) {
  const authOptions = createOptions(adapter);

  const session = await getServerSession(req, res, authOptions);

  if (session && session.user) {
    const userDoc = await adapter.getUser(session.user.id);
    return userDoc;
  }

  const accessTokenUser = await getUserFromAccessToken(req, res, adapter);

  if (accessTokenUser) {
    return accessTokenUser;
  }

  return undefined;
}

export default getUserMiddleware;
