module.exports = async function sleep(durationInSeconds) {
  return new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        durationInSeconds * 1000,
      );
    },
  );
};
