import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import { useThemeMode } from '../theme/ThemeModeProvider.jsx';

const NAV_ITEMS = [
  { label: '首页', to: '/' },
  { label: '标签', to: '/tag' },
  { label: '关于', to: '/about' },
];

/**
 * Top navigation bar: brand, primary links, and the theme toggle.
 * Styled as a semi-transparent, frosted-glass bar (Apple-style).
 * The active link is highlighted based on the current location.
 */
export default function NavBar() {
  const location = useLocation();
  const { mode } = useThemeMode();

  const isDark = mode === 'dark';
  const glassBg = isDark ? 'rgba(29,29,31,0.72)' : 'rgba(251,251,253,0.72)';
  const glassBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: glassBg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${glassBorder}`,
        backgroundImage: 'none',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'text.primary',
            fontWeight: 600,
            mr: 4,
            whiteSpace: 'nowrap',
            fontFamily:
              '"Inter", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
            fontSize: '1.05rem',
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
          }}
        >
          颜培志 · 博客
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1 }}>
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.to}
              component={RouterLink}
              to={item.to}
              sx={{
                textTransform: 'none',
                color: 'text.primary',
                fontWeight: isActive(item.to) ? 600 : 400,
                borderRadius: 999,
                px: 1.5,
                opacity: isActive(item.to) ? 1 : 0.7,
                borderBottom: isActive(item.to)
                  ? '2px solid'
                  : '2px solid transparent',
                borderColor: 'primary.main',
                transition: 'opacity 0.2s ease',
                '&:hover': { opacity: 1 },
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
