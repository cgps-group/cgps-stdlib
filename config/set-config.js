const { setConfig } = require("next/config");

module.exports = function (serverRuntimeConfig) {
  setConfig({ serverRuntimeConfig });
};
