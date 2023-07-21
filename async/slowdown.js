const sleep = require("./sleep.js");

async function slowdown(
  promise,
  durationInSeconds,
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
