"use client";
import { useState, useEffect } from "react";

// ─── Storage ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = "my_notes_data";

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : getSampleNotes();
  } catch {
    return getSampleNotes();
  }
}

function saveNotes(notes) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch {}
}

function getSampleNotes() {
  return [
    { id: "1", title: "Weekly Sync", content: "# Meeting Notes - Discussed project roadmap and upcoming milestones for the Q4 release.", category: "Work", favorite: false, updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: "2", title: "Ideas for App", content: "- Dark mode support using Tailwind\n- Cloud sync with encrypted storage", category: "Personal", favorite: true, updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: "3", title: "Shopping List", content: "1. Almond Milk\n2. Organic Coffee Beans\n3. Greek Yogurt", category: "Daily", favorite: false, updatedAt: new Date("2024-10-24").toISOString() },
    { id: "4", title: "Refactoring Plan", content: "Moving logic from controllers to services for better testability. Need to update the API endpoints and write unit tests.", category: "Work", favorite: false, updatedAt: new Date("2024-10-20").toISOString() },
    { id: "5", title: "Draft: Blog Post", content: "# Why Minimalist Design Matters\nIn a world of constant digital noise, simplicity is the ultimate sophistication.", category: "Writing", favorite: true, updatedAt: new Date("2024-10-15").toISOString() },
  ];
}

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffH = (now - d) / (1000 * 60 * 60);
  const diffD = diffH / 24;
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${Math.floor(diffH)}H AGO`;
  if (diffD < 2) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

const CATEGORIES = ["Work", "Ideas", "Personal", "Daily", "Writing"];
const CAT_COLORS = { Work: "#3b82f6", Ideas: "#eab308", Personal: "#f97316", Daily: "#22c55e", Writing: "#a855f7" };

// ─── Theme tokens (all inline styles — 100% reliable, no Tailwind class conflicts) ──
function theme(dark) {
  return {
    pageBg:      dark ? { background: "linear-gradient(to bottom, #0f172a, #020617)" } : { background: "#f8fafc" },
    title:       { color: dark ? "#ffffff" : "#111827" },
    cardBg:      dark ? { background: "#1e293b", border: "1px solid #334155" } : { background: "#ffffff", border: "1px solid #e5e7eb" },
    searchBg:    dark ? { background: "#1e293b", border: "1px solid #334155", color: "#f1f5f9" } : { background: "#ffffff", border: "1px solid #e5e7eb", color: "#111827" },
    noteTitle:   { color: dark ? "#f1f5f9" : "#111827" },
    subtle:      { color: dark ? "#94a3b8" : "#6b7280" },
    icon:        { color: dark ? "#cbd5e1" : "#374151" },
    navBg:       dark ? { background: "#1e293b", borderTop: "1px solid #334155" } : { background: "#ffffff", borderTop: "1px solid #e5e7eb" },
    activeNav:   { color: "#818cf8" },
    inactiveNav: { color: dark ? "#94a3b8" : "#6b7280" },
    pillActive:  { background: "#4f46e5", color: "#ffffff", border: "1px solid #4f46e5" },
    pillInactive:dark ? { background: "#1e293b", color: "#94a3b8", border: "1px solid #334155" } : { background: "#ffffff", color: "#6b7280", border: "1px solid #e5e7eb" },
    editorBg:    dark ? { background: "#0f172a" } : { background: "#ffffff" },
    border:      dark ? "1px solid #334155" : "1px solid #e5e7eb",
    settingCard: dark ? { background: "#1e293b", border: "1px solid #334155" } : { background: "#ffffff", border: "1px solid #e5e7eb" },
    sectionHead: { color: dark ? "#e2e8f0" : "#1f2937" },
    toggleBg:    dark ? { background: "#334155", color: "#e2e8f0", border: "none" } : { background: "#f3f4f6", color: "#374151", border: "none" },
  };
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Notes: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  Star: ({ filled }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Folder: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Settings: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Sun: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Moon: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  More: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
    </svg>
  ),
  Back: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  Trash: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/>
      <path d="M9 6V4h6v2"/>
    </svg>
  ),
  StarSmall: ({ filled }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#eab308" : "none"} stroke={filled ? "#eab308" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
};

// ─── Note Editor ──────────────────────────────────────────────────────────────
function NoteEditor({ note, onSave, onDelete, onBack, dark }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [category, setCategory] = useState(note.category);
  const [favorite, setFavorite] = useState(note.favorite);
  const [showMenu, setShowMenu] = useState(false);
  const t = theme(dark);

  const handleSave = () => {
    onSave({ ...note, title, content, category, favorite, updatedAt: new Date().toISOString() });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", ...t.editorBg }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 16px 16px", borderBottom: t.border }}>
        <button onClick={() => { handleSave(); onBack(); }}
          style={{ ...t.icon, padding: 8, borderRadius: 8, background: "transparent", border: "none", cursor: "pointer" }}>
          <Icons.Back />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setFavorite(f => !f)}
            style={{ padding: 8, borderRadius: 8, background: "transparent", border: "none", cursor: "pointer", color: favorite ? "#eab308" : t.icon.color }}>
            <Icons.Star filled={favorite} />
          </button>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowMenu(m => !m)}
              style={{ ...t.icon, padding: 8, borderRadius: 8, background: "transparent", border: "none", cursor: "pointer" }}>
              <Icons.More />
            </button>
            {showMenu && (
              <div style={{ position: "absolute", right: 0, marginTop: 4, width: 144, borderRadius: 12, boxShadow: "0 10px 25px rgba(0,0,0,0.3)", ...t.settingCard, zIndex: 10 }}>
                <button
                  onClick={() => { setShowMenu(false); onDelete(note.id); onBack(); }}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", color: "#f87171", background: "transparent", border: "none", cursor: "pointer", borderRadius: 12, fontSize: 14 }}>
                  <Icons.Trash /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category picker */}
      <div style={{ display: "flex", gap: 8, padding: "12px 16px", overflowX: "auto", borderBottom: t.border }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            style={category === cat
              ? { background: CAT_COLORS[cat] + "33", color: CAT_COLORS[cat], border: `1px solid ${CAT_COLORS[cat]}`, padding: "4px 12px", borderRadius: 999, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }
              : { ...t.pillInactive, padding: "4px 12px", borderRadius: 999, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }
            }>
            {cat}
          </button>
        ))}
      </div>

      {}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 16px 0", gap: 12 }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          style={{ fontSize: 24, fontWeight: 700, background: "transparent", border: "none", outline: "none", width: "100%", ...t.title }}
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Start writing..."
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", resize: "none", fontSize: 14, lineHeight: 1.7, minHeight: "60vh", ...t.subtle }}
        />
      </div>

      {/* Save button */}
      <div style={{ padding: 16, borderTop: t.border }}>
        <button onClick={() => { handleSave(); onBack(); }}
          style={{ width: "100%", padding: 12, background: "#4f46e5", color: "#ffffff", border: "none", borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
          Save Note
        </button>
      </div>
    </div>
  );
}

function SettingsScreen({ onBack, onClearAll, dark, setDark }) {
  const t = theme(dark);

  return (
    <div style={{ minHeight: "100vh", ...t.pageBg, padding: "24px 16px" }}>
      <div style={{ maxWidth: 672, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={onBack}
            style={{ ...t.icon, padding: 8, background: "transparent", border: "none", borderRadius: 8, cursor: "pointer" }}>
            <Icons.Back />
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, ...t.title }}>Settings</h1>
        </div>

        {/* Appearance */}
        <div style={{ ...t.settingCard, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <h2 style={{ fontWeight: 600, marginTop: 0, marginBottom: 12, ...t.sectionHead }}>Appearance</h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={t.subtle}>Theme</span>
            <button onClick={() => setDark(d => !d)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, fontSize: 14, cursor: "pointer", ...t.toggleBg }}>
              {dark ? <Icons.Moon /> : <Icons.Sun />}
              {dark ? "Dark" : "Light"}
            </button>
          </div>
        </div>

        {/* About */}
        <div style={{ ...t.settingCard, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <h2 style={{ fontWeight: 600, marginTop: 0, marginBottom: 4, ...t.sectionHead }}>About</h2>
          <p style={{ margin: 0, fontSize: 14, ...t.subtle }}>My Notes — v1.0.0</p>
        </div>

        {/* Danger */}
        <div style={{ background: "rgba(127,29,29,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, padding: 16 }}>
          <h2 style={{ fontWeight: 600, marginTop: 0, marginBottom: 8, color: "#f87171" }}>Danger Zone</h2>
          <p style={{ margin: "0 0 12px", fontSize: 14, ...t.subtle }}>This will permanently delete all your notes.</p>
          <button
            onClick={() => { if (confirm("Clear all notes? This cannot be undone.")) { onClearAll(); onBack(); } }}
            style={{ padding: "8px 16px", background: "#b91c1c", color: "#ffffff", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>
            Clear All Notes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [notes, setNotes] = useState([]);
  const [screen, setScreen] = useState("list");
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("notes");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [dark, setDark] = useState(true);

  useEffect(() => { setNotes(loadNotes()); }, []);

  const persist = (updated) => { setNotes(updated); saveNotes(updated); };

  const createNote = () => {
    const note = { id: Date.now().toString(), title: "Untitled", content: "", category: "Personal", favorite: false, updatedAt: new Date().toISOString() };
    persist([note, ...notes]);
    setEditingNote(note);
    setScreen("editor");
  };

  const openNote = (note) => { setEditingNote(note); setScreen("editor"); };
  const saveNote = (updated) => persist(notes.map(n => n.id === updated.id ? updated : n));
  const deleteNote = (id) => persist(notes.filter(n => n.id !== id));
  const clearAll = () => persist([]);
  const toggleFavorite = (e, id) => { e.stopPropagation(); persist(notes.map(n => n.id === id ? { ...n, favorite: !n.favorite } : n)); };
  const handleDelete = (e, id) => { e.stopPropagation(); persist(notes.filter(n => n.id !== id)); };

  const filteredNotes = notes.filter(note => {
    const matchSearch = note.title.toLowerCase().includes(search.toLowerCase()) || note.content.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || note.category === filter;
    const matchView = view === "notes" || (view === "favorites" && note.favorite) || (view === "folders" && (selectedFolder ? note.category === selectedFolder : true));
    return matchSearch && matchFilter && matchView;
  });

  const folders = Array.from(new Set(notes.map(n => n.category)));
  const t = theme(dark);

  if (screen === "editor" && editingNote) {
    return <NoteEditor note={editingNote} onSave={saveNote} onDelete={deleteNote} onBack={() => { setNotes(loadNotes()); setScreen("list"); }} dark={dark} />;
  }
  if (screen === "settings") {
    return <SettingsScreen onBack={() => setScreen("list")} onClearAll={clearAll} dark={dark} setDark={setDark} />;
  }

  // ── List Screen ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", ...t.pageBg }}>
      <div style={{ maxWidth: 672, margin: "0 auto", paddingBottom: 112 }}>

        {/* Header */}
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 16px 16px" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, ...t.title }}>My Notes</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setDark(d => !d)}
              style={{ ...t.icon, padding: 8, background: "transparent", border: "none", borderRadius: 999, cursor: "pointer" }}>
              {dark ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            <button onClick={() => setScreen("settings")}
              style={{ ...t.icon, padding: 8, background: "transparent", border: "none", borderRadius: 999, cursor: "pointer" }}>
              <Icons.More />
            </button>
          </div>
        </header>

        {/* Search */}
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", ...t.subtle }}>
              <Icons.Search />
            </span>
            <input
              placeholder="Search notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", paddingLeft: 36, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderRadius: 12, outline: "none", fontSize: 14, boxSizing: "border-box", ...t.searchBg }}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: 8, padding: "0 16px 20px", overflowX: "auto" }}>
          {["All", ...CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              style={{ ...(filter === cat ? t.pillActive : t.pillInactive), padding: "6px 16px", borderRadius: 999, fontSize: 14, whiteSpace: "nowrap", cursor: "pointer" }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Folder pills */}
        {view === "folders" && (
          <div style={{ padding: "0 16px 16px" }}>
            <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", ...t.subtle }}>Folders</p>
            <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
              <button onClick={() => setSelectedFolder(null)}
                style={{ ...(selectedFolder === null ? t.pillActive : t.pillInactive), padding: "6px 16px", borderRadius: 999, fontSize: 14, whiteSpace: "nowrap", cursor: "pointer" }}>
                All
              </button>
              {folders.map(cat => (
                <button key={cat} onClick={() => setSelectedFolder(s => s === cat ? null : cat)}
                  style={selectedFolder === cat
                    ? { background: CAT_COLORS[cat] + "33", color: CAT_COLORS[cat], border: `1px solid ${CAT_COLORS[cat]}`, padding: "6px 16px", borderRadius: 999, fontSize: 14, whiteSpace: "nowrap", cursor: "pointer" }
                    : { ...t.pillInactive, padding: "6px 16px", borderRadius: 999, fontSize: 14, whiteSpace: "nowrap", cursor: "pointer" }
                  }>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* View label */}
        {view !== "notes" && (
          <p style={{ margin: "0 0 12px", padding: "0 16px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", ...t.subtle }}>
            {view === "favorites" ? "⭐ Starred Notes" : "📁 Folders"}
          </p>
        )}

        {/* Notes list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 16px" }}>
          {filteredNotes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0", ...t.noteTitle }}>
              <p style={{ fontSize: 36, marginBottom: 12 }}>📝</p>
              <p style={{ fontWeight: 500, margin: "0 0 4px" }}>No notes found</p>
              <p style={{ fontSize: 14, margin: 0, ...t.subtle }}>
                {search ? "Try a different search" : view === "favorites" ? "Star a note to see it here" : "Tap + to create a note"}
              </p>
            </div>
          ) : filteredNotes.map(note => (
            <div key={note.id} onClick={() => openNote(note)}
              style={{ ...t.cardBg, padding: 20, borderRadius: 16, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, flex: 1, paddingRight: 8, ...t.noteTitle }}>
                  {note.title || "Untitled"}
                </h2>
                <span style={{ fontSize: 11, whiteSpace: "nowrap", marginTop: 2, ...t.subtle }}>{formatDate(note.updatedAt)}</span>
              </div>
              <p style={{ fontSize: 14, margin: "0 0 16px", lineHeight: 1.6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", ...t.subtle }}>
                {note.content}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: CAT_COLORS[note.category] || "#6b7280" }} />
                <span style={{ fontSize: 14, ...t.subtle }}>{note.category}</span>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={e => toggleFavorite(e, note.id)}
                    style={{ padding: 4, background: "transparent", border: "none", cursor: "pointer", borderRadius: 6 }}>
                    <Icons.StarSmall filled={note.favorite} />
                  </button>
                  <button onClick={e => handleDelete(e, note.id)}
                    style={{ padding: 4, background: "transparent", border: "none", cursor: "pointer", borderRadius: 6, color: "#f87171", opacity: 0.7 }}>
                    <Icons.Trash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAB */}
        <button onClick={createNote}
          style={{ position: "fixed", bottom: 80, right: 24, width: 56, height: 56, background: "#4f46e5", color: "#ffffff", border: "none", borderRadius: "50%", fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(79,70,229,0.4)", cursor: "pointer", zIndex: 10 }}>
          +
        </button>

        {/* Bottom Nav */}
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", zIndex: 10, ...t.navBg }}>
          {[
            { id: "notes",     label: "Notes",     Icon: Icons.Notes },
            { id: "favorites", label: "Favorites",  Icon: () => <Icons.Star filled={view === "favorites"} /> },
            { id: "folders",   label: "Folders",    Icon: Icons.Folder },
          ].map(({ id, label, Icon }) => (
            <button key={id} onClick={() => { setView(id); setFilter("All"); }}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 0", fontSize: 11, background: "transparent", border: "none", cursor: "pointer", ...(view === id ? t.activeNav : t.inactiveNav) }}>
              <Icon />
              {label}
            </button>
          ))}
          <button onClick={() => setScreen("settings")}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 0", fontSize: 11, background: "transparent", border: "none", cursor: "pointer", ...t.inactiveNav }}>
            <Icons.Settings />
            Settings
          </button>
        </nav>

      </div>
    </div>
  );
}