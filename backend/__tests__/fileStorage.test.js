const fs = require('fs').promises;
const path = require('path');
const { initDataFile, addLog, queryLogs, clearLogs } = require('../utils/fileStorage');

// Mock data for testing
const testLogs = [
  {
    level: 'error',
    message: 'Failed to connect to database',
    resourceId: 'server-1234',
    timestamp: '2023-11-15T08:00:00.000Z',
    traceId: 'trace-1',
    spanId: 'span-1',
    commit: 'abc123',
    metadata: {
      parentResourceId: 'server-001'
    }
  },
  {
    level: 'info',
    message: 'User login successful',
    resourceId: 'server-1234',
    timestamp: '2023-11-15T09:15:30.000Z',
    traceId: 'trace-2',
    spanId: 'span-2',
    commit: 'def456',
    metadata: {
      parentResourceId: 'server-002'
    }
  },
  {
    level: 'error',
    message: 'Database connection timeout',
    resourceId: 'server-5678',
    timestamp: '2023-11-15T10:30:45.000Z',
    traceId: 'trace-1',
    spanId: 'span-3',
    commit: 'abc123',
    metadata: {
      parentResourceId: 'server-001'
    }
  },
  {
    level: 'warn',
    message: 'High memory usage detected',
    resourceId: 'server-5678',
    timestamp: '2023-11-15T11:45:00.000Z',
    traceId: 'trace-3',
    spanId: 'span-4',
    commit: 'ghi789',
    metadata: {
      parentResourceId: 'server-003'
    }
  }
];

describe('Log Filtering', () => {
  beforeAll(async () => {
    // Initialize test data
    await initDataFile();
    await clearLogs();
    
    // Add test logs
    for (const log of testLogs) {
      await addLog(log);
    }
  });

  afterAll(async () => {
    // Clean up
    await clearLogs();
  });

  test('should return all logs when no filters are applied', async () => {
    const logs = await queryLogs({});
    expect(logs).toHaveLength(testLogs.length);
  });

  test('should filter logs by level', async () => {
    const logs = await queryLogs({ level: 'error' });
    expect(logs).toHaveLength(2);
    expect(logs.every(log => log.level === 'error')).toBe(true);
  });

  test('should filter logs by resourceId', async () => {
    const logs = await queryLogs({ resourceId: 'server-1234' });
    expect(logs).toHaveLength(2);
    expect(logs.every(log => log.resourceId === 'server-1234')).toBe(true);
  });

  test('should filter logs by traceId', async () => {
    const logs = await queryLogs({ traceId: 'trace-1' });
    expect(logs).toHaveLength(2);
    expect(logs.every(log => log.traceId === 'trace-1')).toBe(true);
  });

  test('should filter logs by spanId', async () => {
    const logs = await queryLogs({ spanId: 'span-1' });
    expect(logs).toHaveLength(1);
    expect(logs[0].spanId).toBe('span-1');
  });

  test('should filter logs by commit', async () => {
    const logs = await queryLogs({ commit: 'abc123' });
    expect(logs).toHaveLength(2);
    expect(logs.every(log => log.commit === 'abc123')).toBe(true);
  });

  test('should filter logs by parentResourceId', async () => {
    const logs = await queryLogs({ parentResourceId: 'server-001' });
    expect(logs).toHaveLength(2);
    expect(logs.every(log => log.metadata.parentResourceId === 'server-001')).toBe(true);
  });

  test('should perform case-insensitive search in message', async () => {
    const logs1 = await queryLogs({ message: 'database' });
    const logs2 = await queryLogs({ message: 'DATABASE' });
    
    expect(logs1).toHaveLength(2);
    expect(logs2).toHaveLength(2);
    expect(logs1).toEqual(logs2);
  });

  test('should filter logs by date range', async () => {
    const logs = await queryLogs({
      startDate: '2023-11-15T09:00:00.000Z',
      endDate: '2023-11-15T11:00:00.000Z'
    });
    
    expect(logs).toHaveLength(2);
    logs.forEach(log => {
      const logTime = new Date(log.timestamp).getTime();
      expect(logTime).toBeGreaterThanOrEqual(new Date('2023-11-15T09:00:00.000Z').getTime());
      expect(logTime).toBeLessThanOrEqual(new Date('2023-11-15T11:00:00.000Z').getTime());
    });
  });

  test('should combine multiple filters', async () => {
    const logs = await queryLogs({
      level: 'error',
      resourceId: 'server-1234',
      message: 'database'
    });
    
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('error');
    expect(logs[0].resourceId).toBe('server-1234');
    expect(logs[0].message.toLowerCase()).toContain('database');
  });

  test('should return empty array if no logs match the filters', async () => {
    const logs = await queryLogs({
      level: 'debug',
      resourceId: 'nonexistent'
    });
    
    expect(logs).toHaveLength(0);
  });
});
