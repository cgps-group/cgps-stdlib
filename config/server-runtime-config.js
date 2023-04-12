const { defaut: getConfig } = require("next/config");

const config = getConfig();

module.exports = config.serverRuntimeConfig;
