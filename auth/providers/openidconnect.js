const logger = require("../../logger");

/*
    "wellKnown": process.env.AUTH_OIDC_WELLKNOWN,
    "scope": process.env.AUTH_OIDC_SCOPE,
    "clientId": process.env.AUTH_OIDC_CLIENT_ID,
    "clientSecret": process.env.AUTH_OIDC_CLIENT_SECRET,
    "checks": process.env.AUTH_OIDC_CHECKS,
    "idToken": process.env.AUTH_OIDC_ID_TOKEN,
    "idAttribute": process.env.AUTH_OIDC_ID_ATTRIBUTE,
    "token_endpoint_auth_method": process.env.AUTH_OIDC_TOKEN_ENDPOINT_AUTH_METHOD,
    "idToken": true,
    "idAttribute": "sub",
    */

module.exports = function (options) {
  return {
    "id": "openidconnect",
    "type": "oauth",
    "name": options.name ?? "OpenID Connect",
    "wellKnown": options.wellKnown,
    "authorization": { "params": { "scope": options.scope ?? "openid email profile" } },
    "clientId": options.clientId,
    "clientSecret": options.clientSecret,
    "checks": options.checks ? options.checks.split(",") : [],
    "client": {
      "token_endpoint_auth_method": options.token_endpoint_auth_method ?? "client_secret_basic",
    },
    "idToken": options.idToken === "1",
    "idAttribute": options.idAttribute ?? "sub",
    profile(profile) {
      (logger.default || logger).debug(
        { profile },
        "openidconnect profile to user",
      );
      return {
        id: profile[options.idAttribute ?? "sub"],
        name: profile[options.nameAttribute ?? "name"],
        email: profile[options.emailAttribute ?? "email"],
      };
    },
  };
};
