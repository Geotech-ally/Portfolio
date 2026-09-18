import "@testing-library/jest-dom/vitest";

const viteEnv = import.meta.env as ImportMetaEnv & {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
};

viteEnv.VITE_SUPABASE_URL ??= "https://example.supabase.co";
viteEnv.VITE_SUPABASE_PUBLISHABLE_KEY ??= "test-anon-key";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});
