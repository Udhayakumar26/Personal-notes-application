"use client"
import React from 'react'
import { cn } from '../../lib/utils'

type Variant = 'default' | 'danger' | 'ghost'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }

export function Button({ variant = 'default', className = '', ...props }: Props) {
  const base = 'inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium'
  const variantClass =
    variant === 'danger'
      ? 'bg-destructive text-destructive-foreground hover:opacity-90'
      : variant === 'ghost'
      ? 'bg-transparent ring-1 ring-border'
      : 'bg-primary text-primary-foreground'

  return <button className={cn(base, variantClass, className)} {...props} />
}

export default Button
