import serverRuntimeConfig from "../../config/server-runtime-config.js";

if (typeof serverRuntimeConfig.auth.adapter !== "object") {
  throw new Error("auth requires an adapter");
}

export default serverRuntimeConfig.auth.adapter;
