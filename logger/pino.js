import pino from "pino";

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
  level: process.env.LOGGER_LEVEL ?? "silent",
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(process.env.NODE_ENV === "development"
    ? {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      },
    }
    : {}
  ),
});

export default logger;
