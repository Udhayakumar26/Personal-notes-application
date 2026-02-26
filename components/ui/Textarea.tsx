"use client"
import React from 'react'
import { cn } from '../../lib/utils'

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({ className = '', ...props }: Props) {
  return (
    <textarea
      className={cn('w-full min-h-[160px] resize-y rounded-md border border-border bg-input p-3 text-sm', className)}
      {...props}
    />
  )
}

export default Textarea
