import axios from 'axios';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface Log {
  _id: string;
  level: LogLevel;
  message: string;
  resourceId: string;
  timestamp?: string;
  traceId?: string;
  spanId?: string;
  commit?: string;
  metadata?: {
    parentResourceId?: string;
  };
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

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle HTTP errors
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Handle network errors
      console.error('Network Error:', error.request);
    } else {
      // Handle other errors
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Logs API
export const logsApi = {
  // Create a new log entry
  createLog: async (logData: Omit<Log, '_id'>) => {
    // If timestamp is not provided, the server will set it to the current time
    const response = await api.post('/logs', logData);
    return response.data;
  },

  // Get logs with filters
  getLogs: async (params: LogsQueryParams = {}): Promise<LogsResponse> => {
    // Convert date objects to ISO strings if they exist
    const queryParams = { ...params };
    if (params.startDate) {
      queryParams.startDate = new Date(params.startDate).toISOString();
    }
    if (params.endDate) {
      queryParams.endDate = new Date(params.endDate).toISOString();
    }

    const response = await api.get<LogsResponse>('/logs', { 
      params: queryParams,
      paramsSerializer: {
        indexes: null, // Prevent array indices in query params
      },
    });
    return response.data;
  },

  // Get a single log by ID
  getLogById: async (id: string): Promise<Log> => {
    const response = await api.get<{ data: Log }>(`/logs/${id}`);
    return response.data.data;
  },
};

// Health check
export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
