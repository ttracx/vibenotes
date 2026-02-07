'use client';

import { useEffect, useState, useCallback } from 'react';
import { useNotesStore } from '@/store/useNotesStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Save,
  Trash2,
  Download,
  FileDown,
  Eye,
  Edit,
  Columns,
  FolderIcon,
} from 'lucide-react';

export default function NoteEditor() {
  const {
    notes,
    folders,
    activeNoteId,
    viewMode,
    setViewMode,
    updateNote,
    deleteNote,
    setActiveNote,
  } = useNotesStore();

  const activeNote = notes.find((n) => n.id === activeNoteId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      setSelectedFolderId(activeNote.folderId);
    }
  }, [activeNote]);

  // Debounced auto-save
  const saveNote = useCallback(() => {
    if (activeNote && (title !== activeNote.title || content !== activeNote.content)) {
      setIsSaving(true);
      updateNote(activeNote.id, { title, content, folderId: selectedFolderId });
      setTimeout(() => setIsSaving(false), 500);
    }
  }, [activeNote, title, content, selectedFolderId, updateNote]);

  useEffect(() => {
    const timer = setTimeout(saveNote, 500);
    return () => clearTimeout(timer);
  }, [title, content, saveNote]);

  const handleFolderChange = (folderId: string | null) => {
    setSelectedFolderId(folderId);
    if (activeNote) {
      updateNote(activeNote.id, { folderId });
    }
    setShowFolderDropdown(false);
  };

  const handleExportMarkdown = () => {
    if (!activeNote) return;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    if (!activeNote) return;
    
    // Dynamic import for client-side only
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    
    const previewElement = document.getElementById('markdown-preview');
    if (!previewElement) return;

    const canvas = await html2canvas(previewElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 190;
    const pageHeight = 277;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
  };

  const handleDelete = () => {
    if (activeNote && confirm('Are you sure you want to delete this note?')) {
      deleteNote(activeNote.id);
    }
  };

  const selectedFolder = folders.find((f) => f.id === selectedFolderId);

  if (!activeNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Edit size={40} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Note Selected
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Select a note from the sidebar or create a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          {/* Folder selector */}
          <div className="relative">
            <button
              onClick={() => setShowFolderDropdown(!showFolderDropdown)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <FolderIcon
                size={14}
                style={{ color: selectedFolder?.color || '#6b7280' }}
              />
              <span className="text-gray-600 dark:text-gray-400">
                {selectedFolder?.name || 'No Folder'}
              </span>
            </button>
            {showFolderDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <button
                  onClick={() => handleFolderChange(null)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FolderIcon size={14} className="text-gray-400" />
                  No Folder
                </button>
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => handleFolderChange(folder.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FolderIcon size={14} style={{ color: folder.color }} />
                    {folder.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Save indicator */}
          {isSaving && (
            <span className="flex items-center gap-1 text-xs text-green-500">
              <Save size={12} />
              Saving...
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* View mode toggles */}
          <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setViewMode('edit')}
              className={`p-2 ${
                viewMode === 'edit'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title="Edit mode"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`p-2 ${
                viewMode === 'split'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title="Split mode"
            >
              <Columns size={16} />
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`p-2 ${
                viewMode === 'preview'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title="Preview mode"
            >
              <Eye size={16} />
            </button>
          </div>

          {/* Export buttons */}
          <button
            onClick={handleExportMarkdown}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            title="Export as Markdown"
          >
            <Download size={16} />
          </button>
          <button
            onClick={handleExportPDF}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            title="Export as PDF"
          >
            <FileDown size={16} />
          </button>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            title="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Title input */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Last updated: {new Date(activeNote.updatedAt).toLocaleString()}
        </p>
      </div>

      {/* Editor / Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div
            className={`${
              viewMode === 'split' ? 'w-1/2 border-r border-gray-200 dark:border-gray-800' : 'w-full'
            } h-full`}
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing in Markdown..."
              className="w-full h-full p-4 bg-transparent resize-none outline-none text-gray-800 dark:text-gray-200 font-mono text-sm"
            />
          </div>
        )}

        {/* Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            id="markdown-preview"
            className={`${
              viewMode === 'split' ? 'w-1/2' : 'w-full'
            } h-full overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900`}
          >
            <article className="prose prose-purple dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </article>
          </div>
        )}
      </div>
    </div>
  );
}
