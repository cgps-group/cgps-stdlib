const path = require("path");
const winston = require("winston");

require("winston-daily-rotate-file");

// const transport = new winston.transports.DailyRotateFile(
//   {
//     filename: `${process.env.LOGGER_APPLICATION ?? "cgps"}-%DATE%.log`,
//     datePattern: "YYYY-MM-DD-HH",
//     zippedArchive: true,
//     maxSize: process.env.LOGGER_MAX_SIZE ?? "64m",
//     maxFiles: process.env.LOGGER_MAX_FILES ?? "90d",
//   }
// );

// transport.on("rotate", function(oldFilename, newFilename) {
//   // do something fun
// });

// const noErrorFilter = winston.format(
//   (info, opts) => { 
// 	  return info.level !== "error" ? info : false;
//   }
// );

let logger;

if (process.env.LOGGER_FILENAME) {
  logger = winston.createLogger(
    {
      level: process.env.LOGGER_LEVEL ?? "info",
      // exitOnError: false,
      format: winston.format.combine(
        // winston.format.label({ label: path.basename(process.mainModule.filename) }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        // Format the metadata object
        winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
      ),
      transports: [
        new winston.transports.DailyRotateFile(
          {
            dirname: process.env.LOGGER_DIR ?? "logs",
            handleExceptions: true,
            handleRejections: true,
            filename: `${process.env.LOGGER_FILENAME ?? "application"}-%DATE%.log`,
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: process.env.LOGGER_MAX_SIZE ?? "64m",
            maxFiles: process.env.LOGGER_MAX_FILES ?? "90d",
            format: winston.format.combine(
              // Render in one line in your log file.
              // If you use prettyPrint() here it will be really
              // difficult to exploit your logs files afterwards.
              winston.format.json(),
            )
          }
        ),
        // new winston.transports.DailyRotateFile(
        //   {
        //     filename: `${process.env.LOGGER_ACCESS_FILE ?? "access"}-%DATE%.log`,
        //     datePattern: "YYYY-MM-DD-HH",
        //     zippedArchive: true,
        //     maxSize: process.env.LOGGER_MAX_SIZE ?? "64m",
        //     maxFiles: process.env.LOGGER_MAX_FILES ?? "90d",
        //     format: winston.format.combine(
        //       noErrorFilter(),
        //       winston.format.timestamp(),
        //     )
        //   }
        // ),
      ],
    }
  );
  const info = logger.info;
  // const debug = logger.debug;
  // const warn = logger.warn;
  // const error = logger.error;

  const reqHeaders = new URLSearchParams(process.env.LOGGER_REQ_HEADERS || "browser=user-agent");

  logger.info = function (message, metadata, context) {
    if (context?.user) {
      metadata.user = context.user.id || context.user.email || context.user;
    }
    else if (context?.req?.user) {
      metadata.user = context.req.user.id || context.req.user.email || context.req.user;
    }

    if (context?.req) {
      metadata.ip = context.req.socket.remoteAddress;
      for (const [ metadataKey, headerName ] of reqHeaders.entries()) {
        metadata[metadataKey] = context.req.headers[headerName]
      }
    }

    info(
      message,
      metadata,
    );
  };

  logger.debug = logger.debug.bind(logger);

  logger.warn = logger.warn.bind(logger);

  logger.error = logger.error.bind(logger);
}
else {
  logger = winston.createLogger({ silent: true });
}

module.exports = logger;
