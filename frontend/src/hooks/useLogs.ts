import { useQuery } from '@tanstack/react-query';
import { logsApi } from '../services/api';
import type { Log, LogLevel } from '../services/api';

// Re-export types for use in other components
export type { Log, LogLevel } from '../services/api';

// Define query params type
interface LogsQueryParams {
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

interface LogsResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: Log[];
}

export const useLogs = <T = LogsResponse>(params: LogsQueryParams = {}) => {
  return useQuery<T, Error>({
    queryKey: ['logs', params],
    queryFn: () => logsApi.getLogs(params) as Promise<T>,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useLog = (id?: string) => {
  return useQuery<Log, Error>({
    queryKey: ['log', id],
    queryFn: () => logsApi.getLogById(id!), // Non-null assertion since we check enabled
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
