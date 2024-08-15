module.exports = function (...args) {
  if (process.env.LOGGER_LEVEL === "debug") {
    console.error(new Date(), ...args);
  }
};
