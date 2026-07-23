import '@testing-library/jest-dom/vitest';

// jsdom does not implement window.matchMedia, which ThemeModeProvider uses to
// read `prefers-color-scheme`. Provide a default mock (light preference) that
// individual tests can override to simulate a dark OS theme.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
