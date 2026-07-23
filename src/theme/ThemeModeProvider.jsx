import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const STORAGE_KEY = 'blog-theme-mode';

const ThemeModeContext = createContext({
  mode: 'light',
  toggle: () => {},
});

/**
 * Resolve the initial color mode.
 * Priority: persisted user choice -> system `prefers-color-scheme` -> light.
 * @return {'light' | 'dark'}
 */
function getInitialMode() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    /* localStorage may be unavailable (private mode); fall through */
  }
  if (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }
  return 'light';
}

/**
 * Provides the MUI theme (with light/dark modes) and exposes a context that
 * lets any component read the current mode and toggle it.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);

  // Persist the user's choice across reloads.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore persistence failures */
    }
    document.body.setAttribute('data-theme', mode);
  }, [mode]);

  const toggle = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#1565c0' },
          secondary: { main: '#00838f' },
          background:
            mode === 'light'
              ? { default: '#f7f8fa', paper: '#ffffff' }
              : { default: '#121212', paper: '#1e1e1e' },
        },
        typography: {
          fontFamily: ['Roboto', 'system-ui', 'sans-serif'].join(','),
          h1: { fontWeight: 700 },
          h2: { fontWeight: 600 },
        },
        shape: { borderRadius: 10 },
      }),
    [mode]
  );

  const ctx = useMemo(() => ({ mode, toggle }), [mode]);

  return (
    <ThemeModeContext.Provider value={ctx}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

/**
 * Access the current theme mode and the toggle handler.
 * @return {{ mode: 'light' | 'dark', toggle: () => void }}
 */
export function useThemeMode() {
  return useContext(ThemeModeContext);
}
