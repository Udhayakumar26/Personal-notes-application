"use client"
import Link from 'next/link'
import React from 'react'
import Card, { CardTitle, CardDescription, CardFooter } from './ui/Card'
import Button from './ui/Button'
import { Note } from '../lib/notes'

type Props = {
  note: Note
  onDelete?: (id: string) => void
}

export default function NoteCard({ note, onDelete }: Props) {
  return (
    <Card className="group hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5">
        <Link href={`/note/${note.id}`} className="no-underline block">
          <div className="flex items-start justify-between mb-2">
            <CardTitle className="text-slate-900 dark:text-slate-100 group-hover:text-primary">{note.title || 'Untitled'}</CardTitle>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{new Date(note.updatedAt).toLocaleDateString()}</span>
          </div>
          <CardDescription className="mt-0 line-clamp-2 leading-relaxed text-slate-500 dark:text-slate-400">{note.content || '—'}</CardDescription>
        </Link>
      </div>

      <CardFooter className="mt-auto p-5 pt-0 flex items-center">
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-xs text-slate-400 ml-2">Notes</span>
        <div className="ml-auto">
          <Button variant="ghost" onClick={() => onDelete?.(note.id)}>
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
