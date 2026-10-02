"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import {
  getServerTheme,
  getTheme,
  setTheme,
  subscribeTheme,
} from "@/lib/theme";

type Props = {
  className?: string;
};

export function ThemeToggle({ className }: Props) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  const isLight = theme === "light";

  return (
    <button
      type="button"
      className={
        className ??
        "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
      }
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={isLight}
      title={isLight ? "Dark mode" : "Light mode"}
      onClick={() => setTheme(isLight ? "dark" : "light")}
    >
      {isLight ? (
        <Moon className="size-5" weight="bold" />
      ) : (
        <Sun className="size-5" weight="bold" />
      )}
    </button>
  );
}
