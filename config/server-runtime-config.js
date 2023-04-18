const getConfig = require("next/config");

const { serverRuntimeConfig } = getConfig.default();

module.exports = serverRuntimeConfig;
