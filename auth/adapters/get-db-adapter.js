const serverRuntimeConfig = require("../../config/server-runtime-config");

// eslint-disable-next-line import/no-mutable-exports
let adapter;

if (serverRuntimeConfig.auth.adapter === "mongodb") {
  adapter = require("./mongodb.js");
}
else if (serverRuntimeConfig.auth.adapter === "postgres") {
  adapter = require("./postgres.js");
}
else {
  throw new Error("auth requires an adapter");
}

module.exports = adapter;
