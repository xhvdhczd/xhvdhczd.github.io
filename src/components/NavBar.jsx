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
            // 像素卡带标题感：Latin/数字用 Press Start 2P，中文回退到点阵哥特 DotGothic16
            fontFamily: '"Press Start 2P", "DotGothic16", monospace',
            // Press Start 2P 很占空间，整体调小以适配导航栏
            fontSize: '0.85rem',
            letterSpacing: '0.04em',
            lineHeight: 1.2,
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
