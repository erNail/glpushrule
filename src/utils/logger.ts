import winston from 'winston';

let logLevel = process.env['LOG_LEVEL'];

if (logLevel === undefined) {
  logLevel = 'info';
}

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(winston.format.splat(), winston.format.colorize(), winston.format.cli()),
  transports: [new winston.transports.Console()],
});

export default logger;
