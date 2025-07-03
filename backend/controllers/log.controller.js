const { StatusCodes } = require('http-status-codes');
const { ApiError } = require('../middleware/errorHandler');

const logger = require('../utils/logger');
const { addLog, queryLogs, initDataFile } = require('../utils/fileStorage');

// Initialize data file on startup
initDataFile().catch(err => {
  logger.error('Failed to initialize data file:', err);
});

/**
 * Create a new log entry
 * @route POST /api/logs
 */
const createLog = async (req, res, next) => {
  try {
    const log = await addLog(req.body);
    logger.info(`Log created with ID: ${log._id}`);
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: log,
    });
  } catch (error) {
    logger.error('Error creating log:', error);
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create log'));
  }
};

/**
 * Get logs with filtering and pagination
 * @route GET /api/logs
 */
const getLogs = async (req, res, next) => {
  try {
    const {
      level,
      message,
      resourceId,
      startDate,
      endDate,
      traceId,
      spanId,
      commit,
      parentResourceId,
      page = 1,
      limit = 10,
    } = req.query;

    // Build the query object based on provided filters
    const filters = {};
    if (level) filters.level = level;
    if (message) filters.message = message;
    if (resourceId) filters.resourceId = resourceId;
    if (traceId) filters.traceId = traceId;
    if (spanId) filters.spanId = spanId;
    if (commit) filters.commit = commit;
    if (parentResourceId) filters.parentResourceId = parentResourceId;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    // Get filtered logs
    let logs = await queryLogs(filters);
    
    const total = logs.length;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const totalPages = Math.ceil(total / limitNum);
    
    // Apply pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedLogs = logs.slice(startIndex, endIndex);

    res.status(StatusCodes.OK).json({
      success: true,
      count: paginatedLogs.length,
      total,
      totalPages,
      currentPage: pageNum,
      data: paginatedLogs,
    });
  } catch (error) {
    logger.error('Error fetching logs:', error);
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch logs'));
  }
};

module.exports = {
  createLog,
  getLogs,
};
