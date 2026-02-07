'use client';

import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="w-64">
        <SearchBar />
      </div>
      <div className="flex items-center gap-4">
        <a
          href="#pricing"
          className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
        >
          Pro: $3.99/mo
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
