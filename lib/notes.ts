export type Note = {
  id: string
  title: string
  content: string
  category?: string
  favorite?: boolean
  updatedAt: string
}

const STORAGE_KEY = 'personal-notes-notes-v1'

function readStorage(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const notes = JSON.parse(raw) as Note[]
    return Array.isArray(notes) ? notes : []
  } catch (e) {
    console.error('Failed to read notes from storage', e)
    return []
  }
}

function writeStorage(notes: Note[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch (e) {
    console.error('Failed to write notes to storage', e)
  }
}

export function loadNotes(): Note[] {
  return readStorage().sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1))
}

export function getNote(id: string): Note | undefined {
  return readStorage().find((n) => n.id === id)
}

export function createNote(): Note {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now().toString()
  const now = new Date().toISOString()
  const note: Note = { id, title: 'Untitled', content: '', category: 'Personal', favorite: false, updatedAt: now }
  const notes = readStorage()
  notes.unshift(note)
  writeStorage(notes)
  return note
}

export function updateNote(updated: Note) {
  const notes = readStorage()
  const idx = notes.findIndex((n) => n.id === updated.id)
  if (idx >= 0) {
    notes[idx] = updated
  } else {
    notes.unshift(updated)
  }
  writeStorage(notes)
}

export function deleteNote(id: string) {
  const notes = readStorage().filter((n) => n.id !== id)
  writeStorage(notes)
}

export function clearAllNotes() {
  writeStorage([])
}
