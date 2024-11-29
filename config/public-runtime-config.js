import getConfig from "next/config";

const { publicRuntimeConfig } = (getConfig.default || getConfig)() ?? {};

export default publicRuntimeConfig;
