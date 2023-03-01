const getConfig = require("next/config").default;

const config = getConfig();

module.exports = config.serverRuntimeConfig;
