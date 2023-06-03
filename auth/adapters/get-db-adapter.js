const serverRuntimeConfig = require("../../config/server-runtime-config.js").default;

// eslint-disable-next-line import/no-mutable-exports
let adapter;

if (serverRuntimeConfig.auth.adapter === "mongodb") {
  adapter = require("./mongodb.js");
}
else if (serverRuntimeConfig.auth.adapter === "prisma") {
  adapter = require("./prisma.js");
}
else {
  throw new Error("auth requires an adapter");
}

module.exports = adapter;
