export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogMetadata {
  parentResourceId?: string;
  [key: string]: unknown;
}

export interface Log {
  _id: string;
  level: LogLevel;
  message: string;
  resourceId: string;
  timestamp: string;
  traceId: string;
  spanId: string;
  commit: string;
  metadata: LogMetadata;
  createdAt: string;
}

export interface LogsResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: Log[];
}

export interface LogsQueryParams {
  level?: LogLevel;
  message?: string;
  resourceId?: string;
  startDate?: string;
  endDate?: string;
  traceId?: string;
  spanId?: string;
  commit?: string;
  parentResourceId?: string;
  page?: number;
  limit?: number;
}
