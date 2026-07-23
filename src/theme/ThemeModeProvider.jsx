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
 * Build the MUI component overrides that give the UI its retro "NES" pixel look.
 * Only visual styling (hard edges, solid offset shadows, pixel borders) is
 * changed; component behavior and APIs are untouched.
 *
 * @param {'light' | 'dark'} mode - the active color mode
 * @return {Record<string, object>} MUI `components` override map
 */
function buildPixelComponents(mode) {
  // High-contrast dark ink used for borders in both modes (pure black on the
  // dark background reads as a crisp cartridge edge).
  const borderColor = mode === 'dark' ? '#000000' : '#1a1a1a';

  return {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: `3px solid ${borderColor}`,
          boxShadow: '4px 4px 0 rgba(0, 0, 0, 0.35)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          // Light mode gets a visible ink border; dark mode relies on the
          // paper/background contrast instead.
          ...(mode === 'light' ? { border: '2px solid #1a1a1a' } : {}),
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '2px solid currentColor',
          boxShadow: '3px 3px 0 rgba(0, 0, 0, 0.3)',
          // Pressed feel: shift the button down and shrink the offset shadow.
          '&:active': {
            transform: 'translate(2px, 2px)',
            boxShadow: '1px 1px 0 rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '1px solid currentColor',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          borderBottom: `3px solid ${borderColor}`,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  };
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
          ...(mode === 'dark'
            ? {
                primary: { main: '#0058F8' },
                secondary: { main: '#E60012' },
                warning: { main: '#FBD800' },
                success: { main: '#00A651' },
                background: { default: '#0d0d0d', paper: '#1a1a1a' },
                text: { primary: '#FCFCFC' },
                divider: '#333333',
              }
            : {
                primary: { main: '#0058F8' },
                secondary: { main: '#E60012' },
                warning: { main: '#FBD800' },
                success: { main: '#00A651' },
                background: { default: '#FCFCFC', paper: '#FFFFFF' },
                text: { primary: '#1a1a1a' },
                divider: '#cccccc',
              }),
        },
        typography: {
          fontFamily: '"DotGothic16", "Press Start 2P", "Courier New", monospace',
          h1: {
            fontFamily: '"Press Start 2P", "DotGothic16", monospace',
            fontWeight: 700,
          },
          h2: {
            fontFamily: '"Press Start 2P", "DotGothic16", monospace',
            fontWeight: 600,
          },
        },
        // Global hard-right-angle corners — the essence of the pixel look.
        shape: { borderRadius: 0 },
        // Retro NES pixel styling for the common MUI components.
        components: buildPixelComponents(mode),
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
