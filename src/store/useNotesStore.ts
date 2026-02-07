'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, Folder, ViewMode } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface NotesState {
  notes: Note[];
  folders: Folder[];
  activeNoteId: string | null;
  activeFolderId: string | null;
  searchQuery: string;
  viewMode: ViewMode;
  darkMode: boolean;
  
  // Note actions
  createNote: (folderId?: string | null) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
  
  // Folder actions
  createFolder: (name: string, color?: string) => Folder;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  setActiveFolder: (id: string | null) => void;
  
  // UI actions
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleDarkMode: () => void;
  
  // Getters
  getActiveNote: () => Note | undefined;
  getFilteredNotes: () => Note[];
  getNotesByFolder: (folderId: string | null) => Note[];
}

const FOLDER_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'
];

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      folders: [],
      activeNoteId: null,
      activeFolderId: null,
      searchQuery: '',
      viewMode: 'split',
      darkMode: true,
      
      createNote: (folderId = null) => {
        const newNote: Note = {
          id: uuidv4(),
          title: 'Untitled Note',
          content: '# New Note\n\nStart writing...',
          folderId: folderId ?? get().activeFolderId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNoteId: newNote.id,
        }));
        return newNote;
      },
      
      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date().toISOString() }
              : note
          ),
        }));
      },
      
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
        }));
      },
      
      setActiveNote: (id) => set({ activeNoteId: id }),
      
      createFolder: (name, color) => {
        const newFolder: Folder = {
          id: uuidv4(),
          name,
          color: color || FOLDER_COLORS[Math.floor(Math.random() * FOLDER_COLORS.length)],
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          folders: [...state.folders, newFolder],
        }));
        return newFolder;
      },
      
      updateFolder: (id, updates) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, ...updates } : folder
          ),
        }));
      },
      
      deleteFolder: (id) => {
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
          notes: state.notes.map((note) =>
            note.folderId === id ? { ...note, folderId: null } : note
          ),
          activeFolderId: state.activeFolderId === id ? null : state.activeFolderId,
        }));
      },
      
      setActiveFolder: (id) => set({ activeFolderId: id, activeNoteId: null }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setViewMode: (mode) => set({ viewMode: mode }),
      
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      getActiveNote: () => {
        const state = get();
        return state.notes.find((note) => note.id === state.activeNoteId);
      },
      
      getFilteredNotes: () => {
        const state = get();
        const query = state.searchQuery.toLowerCase();
        let filtered = state.notes;
        
        if (state.activeFolderId !== null) {
          filtered = filtered.filter((note) => note.folderId === state.activeFolderId);
        }
        
        if (query) {
          filtered = filtered.filter(
            (note) =>
              note.title.toLowerCase().includes(query) ||
              note.content.toLowerCase().includes(query)
          );
        }
        
        return filtered.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      },
      
      getNotesByFolder: (folderId) => {
        const state = get();
        return state.notes.filter((note) => note.folderId === folderId);
      },
    }),
    {
      name: 'vibenotes-storage',
    }
  )
);
