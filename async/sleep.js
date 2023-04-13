async function sleep(durationInSeconds) {
  return new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        durationInSeconds * 1000,
      );
    },
  );
}

module.exports = sleep;
