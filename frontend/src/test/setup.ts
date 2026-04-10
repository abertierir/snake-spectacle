import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Patch global fetch to support relative API calls against local dev server during tests
const originalFetch = global.fetch;
global.fetch = async (url: RequestInfo | URL, options?: RequestInit) => {
  if (typeof url === 'string' && url.startsWith('/')) {
    url = `http://127.0.0.1:8000${url}`;
  }
  return originalFetch(url, options);
};
