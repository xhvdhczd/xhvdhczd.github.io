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
 * Build the MUI component overrides that give the UI its refined,
 * Apple-style "premium minimal" look: soft layered shadows, hairline
 * borders, and generous rounded corners. Only visual styling changes;
 * component behavior and APIs are untouched.
 *
 * @param {'light' | 'dark'} mode - the active color mode
 * @return {Record<string, object>} MUI `components` override map
 */
function buildSoftComponents(mode) {
  const isDark = mode === 'dark';
  const borderColor = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)';
  const cardShadow = isDark
    ? '0 4px 24px rgba(0,0,0,0.4)'
    : '0 4px 24px rgba(0,0,0,0.06)';
  const hoverShadow = isDark
    ? '0 6px 20px rgba(0,0,0,0.45)'
    : '0 6px 20px rgba(0,0,0,0.12)';

  return {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: `1px solid ${borderColor}`,
          boxShadow: cardShadow,
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: `1px solid ${borderColor}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 500,
          transition:
            'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: hoverShadow,
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 500,
          border: `1px solid ${borderColor}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${borderColor}`,
          boxShadow: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: borderColor,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark
              ? 'rgba(255,255,255,0.22)'
              : 'rgba(0,0,0,0.16)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
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
                primary: { main: '#2997ff' },
                background: { default: '#000000', paper: '#1d1d1f' },
                text: { primary: '#f5f5f7', secondary: '#a1a1a6' },
                divider: 'rgba(255,255,255,0.12)',
              }
            : {
                primary: { main: '#0071e3' },
                background: { default: '#fbfbfd', paper: '#ffffff' },
                text: { primary: '#1d1d1f', secondary: '#6e6e73' },
                divider: 'rgba(0,0,0,0.08)',
              }),
        },
        typography: {
          fontFamily:
            '"Inter", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
          h1: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          },
          h2: {
            fontWeight: 600,
            letterSpacing: '-0.015em',
            lineHeight: 1.2,
          },
          h3: {
            fontWeight: 600,
            letterSpacing: '-0.01em',
            lineHeight: 1.25,
          },
        },
        // Refined, premium rounded corners (no more hard right angles).
        shape: { borderRadius: 10 },
        // Soft, layered Apple-style component styling.
        components: buildSoftComponents(mode),
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
