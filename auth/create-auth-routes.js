/* eslint-disable new-cap */

import NextAuth from "next-auth";

function createAuthRoutes(options) {
  return (req, res) => {
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
}

export default createAuthRoutes;
