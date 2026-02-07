'use client';

import { useNotesStore } from '@/store/useNotesStore';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useNotesStore();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Sun size={18} className="text-yellow-500" />
      ) : (
        <Moon size={18} className="text-gray-600" />
      )}
    </button>
  );
}
