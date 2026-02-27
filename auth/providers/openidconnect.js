const logger = require("../../logger");

module.exports = function (options) {
  return {
    ...options,
    id: "openidconnect",
    type: "oauth",
    profile(profile) {
      logger.debug(
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
