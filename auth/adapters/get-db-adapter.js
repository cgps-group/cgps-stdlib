import serverRuntimeConfig from "../../config/server-runtime-config.js";

if (!serverRuntimeConfig.auth.adapter) {
  throw new Error("auth requires an adapter");
}

export default serverRuntimeConfig.auth.adapter;
