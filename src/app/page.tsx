'use client';

import { useEffect } from 'react';
import { useNotesStore } from '@/store/useNotesStore';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import NoteEditor from '@/components/NoteEditor';
import Footer from '@/components/Footer';

export default function Home() {
  const { darkMode } = useNotesStore();

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <NoteEditor />
        </div>
      </div>
      <Footer />
    </div>
  );
}
