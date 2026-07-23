import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar.jsx';

/**
 * Global layout: persistent app bar plus a centered content container.
 * Child routes render into `<Outlet />`.
 */
export default function Layout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: 'center',
          color: 'text.secondary',
          fontSize: 14,
        }}
      >
        © {new Date().getFullYear()} 颜培志 · 燕山大学脉冲涡流无损检测实验室
      </Box>
    </Box>
  );
}
