import type { StateStorage } from "zustand/middleware";

/** Batches localStorage writes so clicks stay responsive. */
export function createDebouncedLocalStorage(delayMs = 800): StateStorage {
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  const pending = new Map<string, string>();

  const flush = (name: string) => {
    const next = pending.get(name);
    if (next !== undefined) {
      try {
        localStorage.setItem(name, next);
      } catch {
        /* quota */
      }
    }
    pending.delete(name);
    timers.delete(name);
  };

  const schedule = (name: string, value: string) => {
    pending.set(name, value);
    const existing = timers.get(name);
    if (existing) clearTimeout(existing);

    const run = () => flush(name);

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      timers.set(
        name,
        window.setTimeout(() => {
          window.requestIdleCallback(run, { timeout: delayMs + 200 });
        }, delayMs) as ReturnType<typeof setTimeout>
      );
    } else {
      timers.set(name, setTimeout(run, delayMs));
    }
  };

  return {
    getItem: (name) => {
      if (typeof window === "undefined") return null;
      return localStorage.getItem(name);
    },
    setItem: (name, value) => {
      if (typeof window === "undefined") return;
      schedule(name, value);
    },
    removeItem: (name) => {
      if (typeof window === "undefined") return;
      const t = timers.get(name);
      if (t) clearTimeout(t);
      timers.delete(name);
      pending.delete(name);
      localStorage.removeItem(name);
    },
  };
}
