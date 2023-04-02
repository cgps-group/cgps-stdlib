/* eslint-disable new-cap */

const NextAuth = require("next-auth").default;

const options = require("./options.js");

module.exports = function authMiddleware(req, res) {
  if (
    req.method === "GET"
    &&
    req.url.startsWith("/api/auth/callback/email")
    &&
    !req.headers.cookie
  ) {
    return res.status(200).send();
  }

  if (req.method === "HEAD") {
    return res.status(200).send();
  }

  // res.setHeader("Set-Cookie", "cgps-next-auth=true; Path=/");

  return NextAuth(req, res, options);
};
