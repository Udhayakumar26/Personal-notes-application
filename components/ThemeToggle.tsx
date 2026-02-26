"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light'|'dark'>(() => {
    try {
      const stored = localStorage.getItem('pn_theme');
      return (stored as 'light'|'dark') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    try { localStorage.setItem('pn_theme', theme); } catch {}
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">light_mode</span>
      ) : (
        <span className="material-symbols-outlined text-slate-600">dark_mode</span>
      )}
    </button>
  );
}
