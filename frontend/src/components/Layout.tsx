import { Box, Container, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box component="header" sx={{ bgcolor: 'primary.main', color: 'white', py: 2, boxShadow: 1 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1">
            Log Ingestion System
          </Typography>
        </Container>
      </Box>
      
      <Container component="main" maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>
      
      <Box component="footer" sx={{ bgcolor: 'grey.100', py: 3, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Log Ingestion System
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
