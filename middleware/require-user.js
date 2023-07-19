import { ApiError } from "next/dist/server/api-utils";

import getUserMiddleware from "./get-user.js";

async function requireUserMiddleware(req, res, adapter) {
  const user = await getUserMiddleware(req, res, adapter);

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  return user;
}

export default requireUserMiddleware;
