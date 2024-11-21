const sleep = require("./sleep.js");

async function slowdown(
  promise,
  durationInSeconds = 1,
) {
  return (
    Promise.all([
      promise,
      sleep(durationInSeconds),
    ])
      .then(([result]) => result)
  );
}

module.exports = slowdown;
