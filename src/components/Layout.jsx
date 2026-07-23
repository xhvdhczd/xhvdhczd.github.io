import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar.jsx';

/**
 * Global layout: persistent frosted app bar plus a centered content area
 * with generous breathing room (Apple / land-book style).
 * Child routes render into `<Outlet />`.
 */
export default function Layout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <Container
        component="main"
        disableGutters
        maxWidth={false}
        sx={{
          flexGrow: 1,
          width: '100%',
          maxWidth: 1080,
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 4, sm: 6 },
        }}
      >
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{
          py: 4,
          textAlign: 'center',
          color: 'text.secondary',
          fontSize: 14,
          borderTop: '1px solid',
          borderColor: 'divider',
          mt: 6,
        }}
      >
        © {new Date().getFullYear()} 颜培志 · 燕山大学脉冲涡流无损检测实验室
      </Box>
    </Box>
  );
}
