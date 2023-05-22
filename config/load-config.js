import path from "path";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import setConfig from "./set-config.js";

dotenv.config({ path: path.resolve(".", ".env") });

export default function loadConfig(createConfig) {
  // const config = createConfig();
  setConfig(createConfig);
}
