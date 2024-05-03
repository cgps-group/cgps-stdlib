import pino from "pino";

let transport;
if (process.env.NODE_ENV === "development") {
  transport = {
    target: "pino-pretty",
    options: { colorize: true },
  };
}

const logger = pino({
  bindings: (bindings) => {
    return {
      host: bindings.hostname,
      node: process.version,
      pid: bindings.pid,
    };
  },
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  base: undefined,  // WHY: Removes pid and hostname from logs
  level: process.env.LOGGER_LEVEL ?? "silent",
  timestamp: pino.stdTimeFunctions.isoTime,
  transport,
});

export default logger;
