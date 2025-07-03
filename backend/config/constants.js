require('dotenv').config();

const { 
  PORT = 5000,
  NODE_ENV = 'development',
  RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX = 100,
  LOG_LEVEL = 'info',
  DATA_DIR = './data',
  LOGS_FILE = 'logs.json'
} = process.env;

module.exports = {
  PORT,
  NODE_ENV,
  RATE_LIMIT_WINDOW_MS: parseInt(RATE_LIMIT_WINDOW_MS, 10),
  RATE_LIMIT_MAX: parseInt(RATE_LIMIT_MAX, 10),
  LOG_LEVEL,
  DATA_DIR,
  LOGS_FILE,
  LOGS_FILE_PATH: `${DATA_DIR}/${LOGS_FILE}`
};
