const { encode } = require("next-auth/jwt");
const getConfig = require("next/config").default;

const requireUserMiddleware = require('./require-user');

module.exports = async function (req, res) {
  const user = await requireUserMiddleware(req, res);

  const { serverRuntimeConfig } = getConfig();

  const accessToken = await encode({
    token: { id: user.id },
    secret: serverRuntimeConfig.auth.secret,
    maxAge: 5 * 365 * 24 * 60 * 60, // 1825 days
  });

  return accessToken;
};
