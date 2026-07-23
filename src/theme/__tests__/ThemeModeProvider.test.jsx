import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeModeProvider, useThemeMode } from '../ThemeModeProvider.jsx';

const STORAGE_KEY = 'blog-theme-mode';

// Probe component that surfaces the current mode and exposes the toggle.
function Probe() {
  const { mode, toggle } = useThemeMode();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <button type="button" onClick={toggle}>
        toggle
      </button>
    </div>
  );
}

function mockMatchMedia(prefersDark) {
  window.matchMedia = (query) => ({
    matches: prefersDark,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

beforeEach(() => {
  localStorage.clear();
  document.body.removeAttribute('data-theme');
  mockMatchMedia(false); // default: OS prefers light
});

describe('ThemeModeProvider - initial mode resolution', () => {
  it('uses the persisted "dark" choice from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    render(
      <ThemeModeProvider>
        <Probe />
      </ThemeModeProvider>
    );
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });

  it('uses the persisted "light" choice from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'light');
    render(
      <ThemeModeProvider>
        <Probe />
      </ThemeModeProvider>
    );
    expect(screen.getByTestId('mode').textContent).toBe('light');
  });

  it('falls back to prefers-color-scheme: dark when nothing is stored', () => {
    mockMatchMedia(true);
    render(
      <ThemeModeProvider>
        <Probe />
      </ThemeModeProvider>
    );
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });

  it('falls back to light when nothing is stored and OS prefers light', () => {
    mockMatchMedia(false);
    render(
      <ThemeModeProvider>
        <Probe />
      </ThemeModeProvider>
    );
    expect(screen.getByTestId('mode').textContent).toBe('light');
  });

  it('ignores an invalid stored value and uses the system preference', () => {
    localStorage.setItem(STORAGE_KEY, 'neon');
    mockMatchMedia(true);
    render(
      <ThemeModeProvider>
        <Probe />
      </ThemeModeProvider>
    );
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });
});

describe('ThemeModeProvider - persistence and toggling', () => {
  it('persists the user choice to localStorage on mount', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    render(
      <ThemeModeProvider>
        <Probe />
      </ThemeModeProvider>
    );
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    expect(document.body.getAttribute('data-theme')).toBe('dark');
  });

  it('toggles light -> dark, persists, and updates body attribute', () => {
    render(
      <ThemeModeProvider>
        <Probe />
      </ThemeModeProvider>
    );
    expect(screen.getByTestId('mode').textContent).toBe('light');

    act(() => {
      fireEvent.click(screen.getByText('toggle'));
    });

    expect(screen.getByTestId('mode').textContent).toBe('dark');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    expect(document.body.getAttribute('data-theme')).toBe('dark');
  });

  it('toggles back to light and persists the new choice', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    render(
      <ThemeModeProvider>
        <Probe />
      </ThemeModeProvider>
    );
    expect(screen.getByTestId('mode').textContent).toBe('dark');

    act(() => {
      fireEvent.click(screen.getByText('toggle'));
    });

    expect(screen.getByTestId('mode').textContent).toBe('light');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
    expect(document.body.getAttribute('data-theme')).toBe('light');
  });
});
