import { setConfig as setNextConfig } from "next/config";

function setConfig(serverRuntimeConfig) {
  setNextConfig({ serverRuntimeConfig });
}

export default setConfig;

