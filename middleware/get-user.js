import { getServerSession } from "next-auth/next";

import createOptions from "../auth/create-options.js";

async function getUserMiddleware(req, res, adapter) {
  const authOptions = createOptions(adapter);

  const session = await getServerSession(req, res, authOptions);

  if (session && session.user) {
    const userDoc = await adapter.getUser(session.user.id);
    return userDoc;
  }

  return undefined;
}

export default getUserMiddleware;
