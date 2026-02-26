"use client"
import React from 'react'

type Props = React.HTMLAttributes<HTMLDivElement>

export function Card({ className = '', children, ...props }: Props) {
  return (
    <div
      className={"rounded-lg border bg-card text-card-foreground shadow-sm " + className}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className = '', ...props }: Props) {
  return <div className={"flex items-start justify-between p-4 " + className} {...props} />
}

export function CardTitle({ className = '', children, ...props }: Props) {
  return (
    <h3 className={"text-lg font-semibold leading-tight p-0 m-0 " + className} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ className = '', children, ...props }: Props) {
  return (
    <p className={"text-sm text-muted-foreground p-0 m-0 " + className} {...props}>
      {children}
    </p>
  )
}

export function CardFooter({ className = '', ...props }: Props) {
  return <div className={"p-4 pt-0 " + className} {...props} />
}

export default Card
