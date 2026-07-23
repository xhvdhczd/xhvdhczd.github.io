import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from '../theme/ThemeModeProvider.jsx';

/**
 * Button that toggles between light and dark mode.
 * The current mode is read from `ThemeModeProvider`.
 */
export default function ThemeToggle() {
  const { mode, toggle } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <Tooltip title={isDark ? '切换到浅色模式' : '切换到深色模式'}>
      <IconButton
        onClick={toggle}
        color="inherit"
        aria-label="toggle theme mode"
        size="large"
      >
        {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
}
