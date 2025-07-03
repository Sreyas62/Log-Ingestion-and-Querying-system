import { useState, useCallback, useMemo, useEffect } from 'react';
import type { FC } from 'react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import type { SelectChangeEvent } from '@mui/material/Select';
import { 
  Box, Button, Card, CardContent, Chip, Collapse, FormControl, 
  IconButton, InputAdornment, MenuItem, Paper, Select, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, TextField, Tooltip, Typography, TablePagination, 
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ExpandMore, ExpandLess, ContentCopy, FilterList, Clear } from '@mui/icons-material';
import { useLogs } from '../hooks/useLogs';
import type { LogsQueryParams } from '../services/api';
import LogAnalytics from '../components/LogAnalytics';

interface Log {
  _id: string;
  level: 'error' | 'warn' | 'info' | 'debug';
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

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface FilterState {
  level?: LogLevel;
  message?: string;
  resourceId?: string;
  traceId?: string;
  spanId?: string;
  commit?: string;
  parentResourceId?: string;
  startDate?: string | null;
  endDate?: string | null;
}

interface LogRowProps {
  log: Log;
  expanded: boolean;
  onToggle: (id: string) => void;
  onCopyResourceId: (id: string) => void;
  onCopyTraceId: (id: string) => void;
}

const LogRow: FC<LogRowProps> = ({ 
  log, 
  expanded, 
  onToggle, 
  onCopyResourceId, 
  onCopyTraceId 
}) => {
  return (
    <>
      <TableRow hover onClick={() => onToggle(log._id)}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Tooltip title={log.timestamp ? format(parseISO(log.timestamp), 'PPpp') : 'N/A'}>
          <Box>
            <div>{log.timestamp ? format(parseISO(log.timestamp), 'MMM d, yyyy') : 'N/A'}</div>
            <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              {log.timestamp ? formatDistanceToNow(parseISO(log.timestamp), { addSuffix: true }) : ''}
            </div>
          </Box>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Chip
          label={log.level.toUpperCase()}
          color={getLogLevelColor(log.level)}
          size="small"
          sx={{ 
            fontWeight: 600,
            minWidth: 80,
            justifyContent: 'center',
            bgcolor: `${getLogLevelColor(log.level)}.light`,
            '& .MuiChip-label': {
              px: 1,
            }
          }}
        />
      </TableCell>
      <TableCell sx={{ maxWidth: 400 }}>
        <Box 
          sx={{ 
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
            display: 'inline-block',
            verticalAlign: 'middle'
          }}
        >
          {log.message}
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center" gap={1}>
          <span style={{ fontFamily: 'monospace' }}>
            {log.resourceId}
          </span>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onCopyResourceId(log.resourceId);
            }}
            title="Copy Resource ID"
          >
            <ContentCopy fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
      <TableCell>
        {log.traceId && (
          <Box display="flex" alignItems="center" gap={1}>
            <span style={{ fontFamily: 'monospace' }}>
              {log.traceId}
            </span>
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onCopyTraceId(log.traceId!);
              }}
              title="Copy Trace ID"
            >
              <ContentCopy fontSize="small" />
            </IconButton>
          </Box>
        )}
      </TableCell>
      <TableCell>
        <IconButton size="small">
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell style={{ padding: 0 }} colSpan={6}>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box p={2} bgcolor="background.default">
            <Box 
              sx={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                padding: '16px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                '& > div': { 
                  marginBottom: '8px',
                  display: 'flex',
                  '& > span:first-of-type': {
                    fontWeight: 600,
                    minWidth: '140px',
                    display: 'inline-block',
                    color: 'text.secondary'
                  }
                }
              }}
            >
              <div><span>ID:</span> {log._id}</div>
              <div><span>Level:</span> {log.level}</div>
              <div><span>Message:</span> {log.message}</div>
              <div><span>Resource ID:</span> {log.resourceId}</div>
              {log.timestamp && (
                <div><span>Timestamp:</span> {format(parseISO(log.timestamp), 'PPpp')}</div>
              )}
              {log.traceId && (
                <div><span>Trace ID:</span> {log.traceId}</div>
              )}
              {log.spanId && (
                <div><span>Span ID:</span> {log.spanId}</div>
              )}
              {log.commit && (
                <div><span>Commit:</span> {log.commit}</div>
              )}
              {log.metadata?.parentResourceId && (
                <div><span>Parent Resource ID:</span> {log.metadata.parentResourceId}</div>
              )}
            </Box>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  </>);
};

LogRow.displayName = 'LogRow';

const getLogLevelColor = (level?: string) => {
  if (!level) return 'default';
  switch (level.toLowerCase()) {
    case 'error': return 'error';
    case 'warn':
    case 'warning': return 'warning';
    case 'info': return 'info';
    case 'debug': return 'primary';
    default: return 'default';
  }
};

const Dashboard = () => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    level: undefined,
    message: '',
    resourceId: '',
    traceId: '',
    spanId: '',
    commit: '',
    parentResourceId: '',
    startDate: null,
    endDate: null
  });

  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
  });

  const queryParams = useMemo<LogsQueryParams>(() => {
    const params: LogsQueryParams = {
      page: pagination.page + 1,
      limit: pagination.rowsPerPage,
    };

    // Only add filters that have values
    if (filters.level) params.level = filters.level;
    if (filters.message) params.message = filters.message;
    if (filters.resourceId) params.resourceId = filters.resourceId;
    if (filters.traceId) params.traceId = filters.traceId;
    if (filters.spanId) params.spanId = filters.spanId;
    if (filters.commit) params.commit = filters.commit;
    if (filters.parentResourceId) params.parentResourceId = filters.parentResourceId;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    return params;
  }, [filters, pagination.page, pagination.rowsPerPage]);

  // Query for paginated table data
  const { data, isLoading, error } = useLogs(queryParams);
  
  // Query for analytics data (all matching logs, no pagination)
  const { data: analyticsData } = useLogs({
    ...queryParams,
    page: 1,
    limit: 1000 // Set a reasonable limit for analytics
  });
  
  // Log any errors
  useEffect(() => {
    if (error) {
      console.error('Error fetching logs:', error);
    }
  }, [error]);

  const handleFilterChange = useCallback(<K extends keyof FilterState>(
    field: K, 
    value: FilterState[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value
    }));
    setPagination(prev => ({ ...prev, page: 0 }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      level: undefined,
      message: '',
      resourceId: '',
      traceId: '',
      spanId: '',
      commit: '',
      parentResourceId: '',
      startDate: null,
      endDate: null
    });
    setPagination(prev => ({ ...prev, page: 0 }));
  }, []);

  const toggleRowExpanded = useCallback((id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  // Handle level filter change with type safety
  const handleLevelFilterChange = useCallback((event: SelectChangeEvent<LogLevel | ''>) => {
    const value = event.target.value as LogLevel | '';
    handleFilterChange('level', value === '' ? undefined : value);
  }, [handleFilterChange]);

  const handleDateChange = useCallback((field: 'startDate' | 'endDate') => 
    (date: Date | null) => {
      handleFilterChange(field, date ? date.toISOString() : '');
    },
    [handleFilterChange]
  );
  
  const getDateValue = (dateString?: string | null) => {
    if (!dateString) return null;
    try {
      return new Date(dateString);
    } catch {
      return null;
    }
  };

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination({
      page: 0,
      rowsPerPage: parseInt(event.target.value, 10)
    });
  };

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'startDate' || key === 'endDate') {
        return value !== undefined && value !== null;
      }
      return value !== undefined && value !== '' && value !== null;
    });
  }, [filters]);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Logs Dashboard</Typography>
      </Box>

      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1" fontWeight="medium">
              Filter Logs
            </Typography>
            <Box>
              <Button
                size="small"
                startIcon={<FilterList />}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                sx={{ mr: 1 }}
              >
                {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
              </Button>
              {hasActiveFilters && (
                <Button
                  size="small"
                  color="error"
                  startIcon={<Clear />}
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Search Messages"
              variant="outlined"
              size="small"
              value={filters.message || ''}
              onChange={(e) => handleFilterChange('message', e.target.value)}
              InputProps={{
                endAdornment: filters.message && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => handleFilterChange('message', '')}
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={filters.level || ''}
                displayEmpty
                inputProps={{ 'aria-label': 'Log Level' }}
                onChange={handleLevelFilterChange as any}
                renderValue={(selected: LogLevel | '') => (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: selected ? `${getLogLevelColor(selected as string)}.main` : 'transparent',
                        border: selected ? 'none' : '1px solid rgba(0, 0, 0, 0.23)'
                      }}
                    />
                    {selected ? String(selected).charAt(0).toUpperCase() + String(selected).slice(1) : 'All Levels'}
                  </Box>
                )}
              >
                <MenuItem value="">All Levels</MenuItem>
                <MenuItem value="error">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'error.main' }} />
                    Error
                  </Box>
                </MenuItem>
                <MenuItem value="warn">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'warning.main' }} />
                    Warning
                  </Box>
                </MenuItem>
                <MenuItem value="info">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'info.main' }} />
                    Info
                  </Box>
                </MenuItem>
                <MenuItem value="debug">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main' }} />
                    Debug
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Collapse in={showAdvancedFilters}>
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
              <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
                <TextField
                  label="Resource ID"
                  variant="outlined"
                  size="small"
                  value={filters.resourceId || ''}
                  onChange={(e) => handleFilterChange('resourceId', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Trace ID"
                  variant="outlined"
                  size="small"
                  value={filters.traceId || ''}
                  onChange={(e) => handleFilterChange('traceId', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Span ID"
                  variant="outlined"
                  size="small"
                  value={filters.spanId || ''}
                  onChange={(e) => handleFilterChange('spanId', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Commit"
                  variant="outlined"
                  size="small"
                  value={filters.commit || ''}
                  onChange={(e) => handleFilterChange('commit', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Parent Resource ID"
                  variant="outlined"
                  size="small"
                  value={filters.parentResourceId || ''}
                  onChange={(e) => handleFilterChange('parentResourceId', e.target.value)}
                  fullWidth
                />
                <Box display="flex" gap={2} alignItems="center">
                  <DatePicker
                    label="Start Date"
                    value={getDateValue(filters.startDate)}
                    onChange={handleDateChange('startDate')}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                  <DatePicker
                    label="End Date"
                    value={getDateValue(filters.endDate)}
                    onChange={handleDateChange('endDate')}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      <Card sx={{ boxShadow: 2, mb: 3 }}>
        <CardContent>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Resource ID</TableCell>
                  <TableCell>Trace ID</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={24} />
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Loading logs...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : data?.data?.length ? (
                  data.data.map((log) => (
                    <LogRow
                      key={log._id}
                      log={log}
                      expanded={!!expandedRows[log._id]}
                      onToggle={toggleRowExpanded}
                      onCopyResourceId={copyToClipboard}
                      onCopyTraceId={copyToClipboard}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="textSecondary">
                        No logs found. Try adjusting your filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {data?.data?.length ? (
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={data?.total || 0}
              rowsPerPage={pagination.rowsPerPage}
              page={pagination.page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          ) : null}
        </CardContent>
      </Card>

      {/* Analytics Section */}
      <Box sx={{ mt: 2, mb: 3 }}>
        <LogAnalytics 
          logs={(analyticsData?.data || []).filter((log): log is Log & { timestamp: string } => !!log.timestamp)}
          timeRange={{
            startDate: filters.startDate || null,
            endDate: filters.endDate || null
          }} 
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
