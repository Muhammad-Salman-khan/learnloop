"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

// Empty array shared by reference between server and client runtime so the
// server snapshot returns `false` for every server-rendered invocation. After
// hydration, the client subscription flips `mounted` to `true` on the very
// first commit. This is the React 19 / `useSyncExternalStore` pattern for the
// classic "have we hydrated yet?" check and avoids the React Compiler's
// `react-hooks/set-state-in-effect` rule.
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // Hydration-safe mounted flag: server sees `false`, client sees `true` on
  // first render after hydration. Until mounted, render an inert button so
  // server and client markup are identical and React doesn't have to patch it.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  // Only read next-themes values after hydration, otherwise the SSR pass
  // (`resolvedTheme === undefined`) diverges from the client's resolved value
  // (read from localStorage / system pref) and produces a hydration mismatch
  // on `aria-label`, icon classes, etc.
  const isDark = mounted && resolvedTheme === "dark";
  const ariaLabel = mounted
    ? isDark
      ? "Switch to light theme"
      : "Switch to dark theme"
    : "Toggle theme";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={ariaLabel}
      // Attribute is driven by a client-only source; suppress the only
      // element that legitimately differs across the SSR/CSR boundary.
      suppressHydrationWarning
      onClick={() => setTheme(isDark ? "light" : "dark")}
      disabled={!mounted}
    >
      <Sun
        className={
          mounted
            ? "size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            : "size-4"
        }
        aria-hidden="true"
      />
      <Moon
        className={
          mounted
            ? "absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            : "size-4"
        }
        aria-hidden="true"
      />
    </Button>
  );
}

export default ThemeToggle;
