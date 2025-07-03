const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { LOGS_FILE_PATH, DATA_DIR } = require('../config/constants');

// Ensure the data directory exists
const ensureDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
};

// Initialize the data file if it doesn't exist
const initDataFile = async () => {
  await ensureDataDir();
  try {
    await fs.access(LOGS_FILE_PATH);
  } catch (error) {
    await fs.writeFile(LOGS_FILE_PATH, JSON.stringify([], null, 2), 'utf8');
  }
};

// Read logs from file
const readLogs = async () => {
  try {
    await initDataFile();
    const data = await fs.readFile(LOGS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading logs file:', error);
    throw error;
  }
};

// Write logs to file
const writeLogs = async (logs) => {
  try {
    await fs.writeFile(LOGS_FILE_PATH, JSON.stringify(logs, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to logs file:', error);
    throw error;
  }
};

// Add a new log
const addLog = async (logData) => {
  const logs = await readLogs();
  const newLog = {
    _id: uuidv4(),
    ...logData,
    timestamp: logData.timestamp || new Date().toISOString(),
    metadata: logData.metadata || {}
  };
  logs.push(newLog);
  await writeLogs(logs);
  return newLog;
};

// Query logs with filters
const queryLogs = async (filters = {}) => {
  let logs = await readLogs();
  
  // Apply filters
  if (filters.level) {
    logs = logs.filter(log => log.level === filters.level);
  }
  
  if (filters.resourceId) {
    logs = logs.filter(log => log.resourceId === filters.resourceId);
  }
  
  if (filters.traceId) {
    logs = logs.filter(log => log.traceId === filters.traceId);
  }
  
  if (filters.spanId) {
    logs = logs.filter(log => log.spanId === filters.spanId);
  }
  
  if (filters.commit) {
    logs = logs.filter(log => log.commit === filters.commit);
  }
  
  if (filters.parentResourceId) {
    logs = logs.filter(log => log.metadata?.parentResourceId === filters.parentResourceId);
  }
  
  // Text search on message field (case-insensitive)
  if (filters.message) {
    const searchTerm = filters.message.toLowerCase();
    logs = logs.filter(log => 
      log.message && log.message.toLowerCase().includes(searchTerm)
    );
  }
  
  // Date range filter
  if (filters.startDate || filters.endDate) {
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;
    
    logs = logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return (!startDate || logDate >= startDate) && 
             (!endDate || logDate <= endDate);
    });
  }
  
  // Sort by timestamp (newest first)
  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  return logs;
};

// Clear all logs from storage
const clearLogs = async () => {
  await writeLogs([]);
};

module.exports = {
  initDataFile,
  addLog,
  queryLogs,
  readLogs,
  writeLogs,
  clearLogs
};
