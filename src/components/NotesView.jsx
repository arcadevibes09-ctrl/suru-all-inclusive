// FILE: src/components/NotesView.jsx
import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Sparkles,
  Eye,
  Edit3,
  Search,
  BookMarked
} from 'lucide-react';
import NotebookPage from '../NotebookPage';
import { aiEngine } from '../ai/localAI';
import '../styles/NotesView.css';

const NOTE_FOLDERS = ['All', 'Personal', 'Study', 'Ideas', 'Journal'];

export default function NotesView({ notes, setNotes }) {
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id || null);
  const [previewMode, setPreviewMode] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);

  const [showGlossaryBox, setShowGlossaryBox] = useState(false);
  const [termKey, setTermKey] = useState('');
  const [termDef, setTermDef] = useState('');

  const filteredNotes = notes.filter((n) => {
    const matchesFolder =
      selectedFolder === 'All' || (n.folder || 'Personal') === selectedFolder;
    const matchesSearch =
      !searchQuery.trim() ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const activeIndex = filteredNotes.findIndex((n) => n.id === activeNoteId);
  const resolvedIndex = activeIndex !== -1 ? activeIndex : 0;
  const activeNote = filteredNotes[resolvedIndex] || null;

  const hasPrevNote = resolvedIndex > 0;
  const hasNextNote = resolvedIndex < filteredNotes.length - 1;

  const handleCreateNote = () => {
    const nowStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    const newNote = {
      id: 'note_' + Date.now(),
      title: 'UNTITLED NOTE',
      subtitle: nowStr,
      folder: selectedFolder === 'All' ? 'Personal' : selectedFolder,
      text: '',
      glossary: {},
      updatedAt: nowStr
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    setActiveNoteId(newNote.id);
    setPreviewMode(false);
  };

  const handleUpdateNote = (field, value) => {
    if (!activeNote) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNote.id
          ? {
              ...n,
              [field]: value,
              updatedAt: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })
            }
          : n
      )
    );
  };

  const handleAddGlossaryTerm = (e) => {
    e.preventDefault();
    if (!activeNote || !termKey.trim() || !termDef.trim()) return;
    const nextGlossary = {
      ...(activeNote.glossary || {}),
      [termKey.trim()]: termDef.trim()
    };
    handleUpdateNote('glossary', nextGlossary);
    if (!activeNote.text.includes(`[[${termKey.trim()}]]`)) {
      handleUpdateNote('text', `${activeNote.text} [[${termKey.trim()}]] `);
    }
    setTermKey('');
    setTermDef('');
    setShowGlossaryBox(false);
  };

  const handleDeleteNote = (id) => {
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    if (activeNoteId === id) {
      setActiveNoteId(remaining[0]?.id || null);
    }
  };

  const handleFormatWithAI = async () => {
    if (!activeNote || !activeNote.text.trim() || aiBusy) return;
    setAiBusy(true);
    try {
      const prompt = `Organize and enrich the following personal note using ## Headings, {{highlights}}, and [[[Key Summary or Example Box]]]:\n\n${activeNote.text}`;
      const reply = await aiEngine.ask(prompt);
      handleUpdateNote('text', activeNote.text + '\n\n[PAGE]\n\n## AI Structured Note\n\n' + reply);
    } catch {
      // Ignore if offline
    }
    setAiBusy(false);
  };

  return (
    <div className="notes-full-view">
      <div className="notes-top-strip">
        <div className="notes-folder-pills">
          {NOTE_FOLDERS.map((folder) => (
            <button
              key={folder}
              className={`uni-btn subtle ${selectedFolder === folder ? 'active' : ''}`}
              onClick={() => setSelectedFolder(folder)}
            >
              {folder}
            </button>
          ))}
        </div>

        <button className="uni-btn subtle active" onClick={handleCreateNote}>
          <Plus size={13} /> New Note
        </button>
      </div>

      <div className="notes-search-row">
        <div className="note-search-pill">
          <Search size={14} color="#666" />
          <input
            placeholder="Search your notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredNotes.length > 0 && (
          <div className="notes-tabs-scroll">
            {filteredNotes.map((n) => (
              <button
                key={n.id}
                className={`uni-btn subtle ${n.id === activeNote?.id ? 'active' : ''}`}
                onClick={() => setActiveNoteId(n.id)}
              >
                {n.title || 'Untitled'}
              </button>
            ))}
          </div>
        )}
      </div>

      {!activeNote ? (
        <div className="notes-empty-card">
          <p>Your personal notebook is empty right now.</p>
          <button className="uni-btn subtle active" onClick={handleCreateNote}>
            <Plus size={14} /> Create Your First Note
          </button>
        </div>
      ) : (
        <div className="note-workspace">
          <div className="note-meta-bar">
            <input
              className="note-title-input"
              value={activeNote.title}
              onChange={(e) => handleUpdateNote('title', e.target.value)}
              placeholder="NOTE TITLE..."
            />

            <div className="note-sub-row">
              <input
                className="note-subtitle-input"
                value={activeNote.subtitle || ''}
                onChange={(e) => handleUpdateNote('subtitle', e.target.value)}
                placeholder="Add subtitle or date context..."
              />
              <select
                className="uni-btn subtle"
                value={activeNote.folder || 'Personal'}
                onChange={(e) => handleUpdateNote('folder', e.target.value)}
              >
                {NOTE_FOLDERS.filter((f) => f !== 'All').map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="note-action-btns">
              <button
                className="uni-btn subtle"
                onClick={() => setShowGlossaryBox((prev) => !prev)}
              >
                <BookMarked size={13} />
                <span>+ Glossary</span>
              </button>

              <button
                className={`uni-btn subtle ${previewMode ? 'active' : ''}`}
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? <Edit3 size={13} /> : <Eye size={13} />}
                <span>{previewMode ? 'Edit' : 'Reader'}</span>
              </button>

              <button
                className="uni-btn subtle"
                onClick={handleFormatWithAI}
                disabled={aiBusy}
              >
                <Sparkles size={13} />
                <span>{aiBusy ? '...' : 'AI'}</span>
              </button>

              <button
                className="uni-btn subtle"
                onClick={() => handleDeleteNote(activeNote.id)}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {showGlossaryBox && (
            <form className="glossary-quick-form" onSubmit={handleAddGlossaryTerm}>
              <input
                placeholder="Term word (e.g. Preload)"
                value={termKey}
                onChange={(e) => setTermKey(e.target.value)}
              />
              <input
                placeholder="Definition shown when tapped..."
                value={termDef}
                onChange={(e) => setTermDef(e.target.value)}
              />
              <button type="submit" className="uni-btn subtle active">
                Save Glossary Term
              </button>
            </form>
          )}

          {previewMode ? (
            <NotebookPage
              topicId={activeNote.id}
              topicData={{
                text: activeNote.text || 'Switch to Edit mode to write your note.',
                glossary: activeNote.glossary
              }}
              hasNextTopic={hasNextNote}
              hasPrevTopic={hasPrevNote}
              onNextTopic={() =>
                hasNextNote && setActiveNoteId(filteredNotes[resolvedIndex + 1].id)
              }
              onPrevTopic={() =>
                hasPrevNote && setActiveNoteId(filteredNotes[resolvedIndex - 1].id)
              }
            />
          ) : (
            <div className="note-editor-area">
              <div className="syntax-helper-bar">
                <button
                  type="button"
                  className="uni-btn subtle"
                  onClick={() =>
                    handleUpdateNote('text', activeNote.text + '\n## Heading\n')
                  }
                >
                  + Heading
                </button>
                <button
                  type="button"
                  className="uni-btn subtle"
                  onClick={() =>
                    handleUpdateNote('text', activeNote.text + ' {{highlight}} ')
                  }
                >
                  + Highlight
                </button>
                <button
                  type="button"
                  className="uni-btn subtle"
                  onClick={() =>
                    handleUpdateNote('text', activeNote.text + '\n[[[Callout Box]]]\n')
                  }
                >
                  + Box
                </button>
                <button
                  type="button"
                  className="uni-btn subtle"
                  onClick={() =>
                    handleUpdateNote('text', activeNote.text + '\n\n[PAGE]\n\n')
                  }
                >
                  + New Page
                </button>
              </div>
              <textarea
                className="note-raw-textarea"
                value={activeNote.text}
                onChange={(e) => handleUpdateNote('text', e.target.value)}
                placeholder="Start typing your own notes, thoughts, or study summaries..."
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
