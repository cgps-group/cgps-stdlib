const logger = require("../../logger");

module.exports = function(options) {
  return {
    ...options,
    id: "openidconnect",
    profile(profile) {
      logger.debug("openidconnect profile to user", { profile });
      return {
        id: profile[options.idAttribute ?? "sub"],
        name: profile[options.nameAttribute ?? "name"],
        email: profile[options.emailAttribute ?? "email"],
      };
    },
  };
};
