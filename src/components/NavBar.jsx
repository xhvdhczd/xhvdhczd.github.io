import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';

const NAV_ITEMS = [
  { label: '首页', to: '/' },
  { label: '标签', to: '/tag' },
  { label: '关于', to: '/about' },
];

/**
 * Top navigation bar: brand, primary links, and the theme toggle.
 * The active link is highlighted based on the current location.
 */
export default function NavBar() {
  const location = useLocation();

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <AppBar position="sticky" color="primary" enableColorOnDark>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
            mr: 4,
            whiteSpace: 'nowrap',
          }}
        >
          颜培志 · 博客
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.to}
              component={RouterLink}
              to={item.to}
              color="inherit"
              sx={{
                textTransform: 'none',
                fontWeight: isActive(item.to) ? 700 : 400,
                borderBottom: isActive(item.to)
                  ? '2px solid currentColor'
                  : '2px solid transparent',
                borderRadius: 0,
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
}
