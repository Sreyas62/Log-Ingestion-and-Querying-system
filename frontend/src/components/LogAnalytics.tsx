import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Paper, Typography, useTheme, Box } from '@mui/material';
import { format } from 'date-fns';

interface LogAnalyticsProps {
  logs: Array<{
    level: 'error' | 'warn' | 'info' | 'debug';
    timestamp?: string;
  }>;
  timeRange?: {
    startDate?: string | null;
    endDate?: string | null;
  };
}

const LogAnalytics = ({ logs, timeRange }: LogAnalyticsProps) => {
  const theme = useTheme();

  // Count logs by level with proper typing
  const countByLevel = useMemo(() => {
    const levels = ['error', 'warn', 'info', 'debug'] as const;
    const counts = levels.reduce((acc, level) => ({ ...acc, [level]: 0 }), {} as Record<typeof levels[number], number>);

    logs.forEach(log => {
      if (log.level in counts) {
        counts[log.level]++;
      }
    });

    // Convert to array of objects for the chart
    return levels.map(level => ({
      name: level.charAt(0).toUpperCase() + level.slice(1),
      value: counts[level],
      level
    }));
  }, [logs]);

  // Check if we have any data to display
  const hasData = useMemo(() => countByLevel.some(item => item.value > 0), [countByLevel]);

  // Generate time range label with better formatting
  const timeRangeLabel = useMemo(() => {
    if (!timeRange?.startDate && !timeRange?.endDate) return 'All Time';
    
    const formatDate = (dateString?: string | null) => {
      if (!dateString) return '';
      try {
        return format(new Date(dateString), 'MMM d, yyyy h:mm a');
      } catch (e) {
        return '';
      }
    };

    const start = formatDate(timeRange.startDate) || 'Beginning';
    const end = formatDate(timeRange.endDate) || 'Now';
    
    return `${start} - ${end}`;
  }, [timeRange]);

  // Get color for each log level with better contrast
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return theme.palette.error.main;
      case 'warn': return theme.palette.warning.dark; // Using darker shade for better visibility
      case 'info': return theme.palette.info.dark;   // Using darker shade for better visibility
      case 'debug': return theme.palette.primary.main;
      default: return theme.palette.grey[600];
    }
  };

  if (!hasData) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          textAlign: 'center',
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Log Level Distribution
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {timeRangeLabel}
        </Typography>
        <Box sx={{ py: 4 }}>
          <Typography variant="body1" color="textSecondary">
            No log data available for the selected filters
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Log Level Distribution
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {timeRangeLabel}
        </Typography>
      </Box>
      
      <Box sx={{ height: 300, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={countByLevel}
            margin={{ top: 16, right: 24, left: 0, bottom: 24 }}
            barSize={36}
            barGap={2}
            barCategoryGap="20%"
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke={theme.palette.divider}
            />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.palette.text.secondary }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.palette.text.secondary }}
              width={32}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[3],
              }}
              formatter={(value: number) => [`${value} logs`, 'Count']}
              labelFormatter={(label) => `Level: ${label}`}
              cursor={{ fill: theme.palette.action.hover }}
            />
            <Bar 
              dataKey="value"
              name="Logs"
              radius={[4, 4, 0, 0]}
            >
              {countByLevel.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getLevelColor(entry.level)}
                  stroke={theme.palette.background.paper}
                  strokeWidth={2}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default LogAnalytics;
