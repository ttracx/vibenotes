'use client';

import { useState } from 'react';
import { useNotesStore } from '@/store/useNotesStore';
import {
  FolderPlus,
  FileText,
  Plus,
  Trash2,
  FolderIcon,
  ChevronRight,
  ChevronDown,
  Edit2,
  Check,
  X,
  FileStack,
} from 'lucide-react';

export default function Sidebar() {
  const {
    folders,
    notes,
    activeFolderId,
    activeNoteId,
    createNote,
    createFolder,
    deleteFolder,
    updateFolder,
    setActiveFolder,
    setActiveNote,
    deleteNote,
    getFilteredNotes,
  } = useNotesStore();

  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const filteredNotes = getFilteredNotes();
  const uncategorizedNotes = notes.filter((n) => n.folderId === null);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName('');
      setIsAddingFolder(false);
    }
  };

  const handleEditFolder = (id: string) => {
    if (editingFolderName.trim()) {
      updateFolder(id, { name: editingFolderName.trim() });
      setEditingFolderId(null);
      setEditingFolderName('');
    }
  };

  const toggleFolderExpand = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <aside className="w-72 h-full flex flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            VibeNotes
          </h1>
          <button
            onClick={() => createNote()}
            className="p-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-colors"
            title="New Note"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Folders */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {/* All Notes */}
          <button
            onClick={() => setActiveFolder(null)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              activeFolderId === null
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <FileStack size={18} />
            <span className="flex-1 text-left text-sm font-medium">All Notes</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{notes.length}</span>
          </button>

          {/* Folders Section */}
          <div className="mt-4">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Folders
              </span>
              <button
                onClick={() => setIsAddingFolder(true)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                title="New Folder"
              >
                <FolderPlus size={14} />
              </button>
            </div>

            {/* Add Folder Input */}
            {isAddingFolder && (
              <div className="flex items-center gap-1 px-2 mb-2">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                  placeholder="Folder name..."
                  className="flex-1 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
                <button
                  onClick={handleCreateFolder}
                  className="p-1 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => {
                    setIsAddingFolder(false);
                    setNewFolderName('');
                  }}
                  className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Folder List */}
            <div className="space-y-1">
              {folders.map((folder) => {
                const folderNotes = notes.filter((n) => n.folderId === folder.id);
                const isExpanded = expandedFolders.has(folder.id);
                const isEditing = editingFolderId === folder.id;

                return (
                  <div key={folder.id}>
                    <div
                      className={`group flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        activeFolderId === folder.id
                          ? 'bg-purple-100 dark:bg-purple-900/30'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <button
                        onClick={() => toggleFolderExpand(folder.id)}
                        className="p-0.5 text-gray-400"
                      >
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                      <FolderIcon size={16} style={{ color: folder.color }} />
                      
                      {isEditing ? (
                        <div className="flex-1 flex items-center gap-1">
                          <input
                            type="text"
                            value={editingFolderName}
                            onChange={(e) => setEditingFolderName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleEditFolder(folder.id)}
                            className="flex-1 px-1 py-0.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                            autoFocus
                          />
                          <button
                            onClick={() => handleEditFolder(folder.id)}
                            className="p-0.5 text-green-500"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            onClick={() => setEditingFolderId(null)}
                            className="p-0.5 text-red-500"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span
                            onClick={() => setActiveFolder(folder.id)}
                            className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate"
                          >
                            {folder.name}
                          </span>
                          <span className="text-xs text-gray-400">{folderNotes.length}</span>
                          <div className="hidden group-hover:flex items-center gap-0.5">
                            <button
                              onClick={() => {
                                setEditingFolderId(folder.id);
                                setEditingFolderName(folder.name);
                              }}
                              className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => deleteFolder(folder.id)}
                              className="p-0.5 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Folder Notes */}
                    {isExpanded && (
                      <div className="ml-6 mt-1 space-y-0.5">
                        {folderNotes.map((note) => (
                          <button
                            key={note.id}
                            onClick={() => setActiveNote(note.id)}
                            className={`w-full flex items-center gap-2 px-2 py-1 rounded text-sm transition-colors ${
                              activeNoteId === note.id
                                ? 'bg-purple-200 dark:bg-purple-800/40 text-purple-800 dark:text-purple-200'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            <FileText size={12} />
                            <span className="flex-1 text-left truncate">{note.title}</span>
                          </button>
                        ))}
                        <button
                          onClick={() => createNote(folder.id)}
                          className="w-full flex items-center gap-2 px-2 py-1 rounded text-sm text-gray-400 hover:text-purple-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Plus size={12} />
                          <span>Add note</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Uncategorized Notes */}
            {uncategorizedNotes.length > 0 && (
              <div className="mt-4">
                <div className="px-3 mb-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Uncategorized
                  </span>
                </div>
                <div className="space-y-0.5">
                  {uncategorizedNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        activeNoteId === note.id
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => setActiveNote(note.id)}
                    >
                      <FileText size={16} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{note.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(note.updatedAt)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="hidden group-hover:block p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
