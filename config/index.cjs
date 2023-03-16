const fs = require("fs");
const path = require("path");

function generateServerRuntimeConfig() {
  const mergeOptions = require("merge-options");

  const serverRuntimeConfig = require(path.resolve(".", "./defaults.json"));

  const configFilePath = process.env.CONFIG_FILE || path.resolve(".", "config.json");
  if (fs.existsSync(configFilePath)) {
    return mergeOptions(serverRuntimeConfig, require(configFilePath));
  }
  else {
    return serverRuntimeConfig;
  }
}

module.exports = generateServerRuntimeConfig();
