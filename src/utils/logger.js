const LOG_PREFIX = "Trade-Assist FE - ";

const log = (level, message, ...details) => {
  console[level](`${LOG_PREFIX}${message}`, ...details);
};

const logger = {
  info: (message, ...details) => log("info", message, ...details),
  warn: (message, ...details) => log("warn", message, ...details),
  error: (message, ...details) => log("error", message, ...details),
};

export default logger;