"use strict";

const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const fs = require('fs');
const WinstonRotateFile = require('winston-daily-rotate-file');

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const customLogFormat = printf((data) => {
  const timestamp = data.timestamp;
  const level = data.level || 'info';
  const label = data.label || process.env.NODE_ENV || 'default';
  const event = data.event || (data.message ? data.message.event : '') || '';
  const context = data.context || (data.message ? data.message.context : '') || '';
  let message = data.message || '';
  let msg = data.msg || (data.message ? data.message.msg : '') || '';

  if (message && typeof message != 'string') {
    if (typeof message === 'function') {
      message = message.toString();
    } else {
      message = JSON.stringify(message)
    }
  }
  if (msg && typeof msg != 'string') {
    if (typeof msg === 'function') {
      msg = msg.toString();
    } else {
      msg = JSON.stringify(msg)
    }
  }

  return `${timestamp} [${label}] - (${level}) ${context} : ${event} ${msg || message}`;
});

const logger = createLogger({
  levels: winston.config.syslog.levels,
  format: combine(
    timestamp(),
    customLogFormat
  ),
  transports: [
    // new transports.Console(),
    new winston.transports.Console({
      format: combine(
        winston.format.colorize(),
        timestamp(),
        customLogFormat
      ),
    })
  ]
});

if (process.env.NODE_ENV !== 'dev') {
  logger.add(new (WinstonRotateFile)({
    filename: `${logDir}/logs.log`,
    datePattern: 'YYYY-MM-DD',
    timestamp: timestamp(),
    prepend: true,
    level: 'info',
  }))
  logger.add(new (WinstonRotateFile)({
    filename: `${logDir}/error.log`,
    datePattern: 'YYYY-MM-DD',
    timestamp: timestamp(),
    prepend: true,
    level: 'error',
  }))
}

global.logger = logger;

logger.info({ context: 'Logger', event: 'Logger service initialized ~', msg: process.env.NODE_ENV || 'default' });

