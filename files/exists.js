import fs from "fs";

export default async function exists(path) {
  try {
    await fs.promises.access(path);
    return true;
  }
  catch {
    return false;
  }
}
