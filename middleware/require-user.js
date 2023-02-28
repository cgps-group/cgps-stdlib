const { ApiError } = require("next/dist/server/api-utils");
const getUserMiddleware = require("./get-user");

module.exports = async function requireUserMiddleware(req, res) {
  const user = await getUserMiddleware(req, res);

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  return user;
};
