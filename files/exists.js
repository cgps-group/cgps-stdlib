const fs = require("fs");

module.exports = async function (path) {
  try {
    await fs.promises.access(path);
    return true;
  } catch {
    return false;
  }
};
