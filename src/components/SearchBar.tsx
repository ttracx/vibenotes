'use client';

import { useNotesStore } from '@/store/useNotesStore';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useNotesStore();

  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search notes..."
        className="w-full pl-9 pr-8 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-800 dark:text-gray-200 placeholder-gray-500"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
