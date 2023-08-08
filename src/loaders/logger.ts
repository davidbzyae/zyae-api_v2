import config from "@/config";
import winston from "winston";

const errorFileTransportConfig = {
  level: "error",
  handleExceptions: true,
  handleRejections: true,
};

const transports = [];
if (process.env.NODE_ENV === "production") {
  const consoleTransport = new winston.transports.Console();
  const errorFileTransport = new winston.transports.File({
    filename: "./logs/prod/error.prod.log",
    ...errorFileTransportConfig,
  });
  const combinedFileTransport = new winston.transports.File({
    filename: "./logs/prod/combined.prod.log",
  });
  transports.push(consoleTransport, errorFileTransport, combinedFileTransport);
} else if (process.env.NODE_ENV === "development") {
  const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
      winston.format.cli(),
      winston.format.splat()
    ),
  });
  const errorFileTransport = new winston.transports.File({
    filename: "./logs/dev/error.dev.log",
    ...errorFileTransportConfig,
  });
  const combinedFileTransport = new winston.transports.File({
    filename: "./logs/dev/combined.dev.log",
  });
  transports.push(consoleTransport, errorFileTransport, combinedFileTransport);
}

export const Logger = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports,
});
