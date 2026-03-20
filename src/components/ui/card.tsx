import * as React from 'react'

import { cn } from '@/lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'bg-white/60 text-card-foreground',
        'flex flex-col gap-2 rounded-xl py-6',
        'border border-white/80',
        'backdrop-blur-xl',
        'shadow-[0_8px_32px_rgba(0,0,0,0.08)]',
        'transition-all duration-300',
        'hover:-translate-y-0.5',
        'hover:shadow-[0_8px_32px_rgba(124,106,240,0.12)]',
        'hover:border-white/90',
        'dark:bg-[#7c6af0]/[0.08]',
        'dark:border-[#7c6af0]/[0.15]',
        'dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(124,106,240,0.1)]',
        'dark:hover:bg-[#7c6af0]/[0.12]',
        'dark:hover:border-[#7c6af0]/[0.25]',
        'dark:hover:shadow-[0_8px_32px_rgba(124,106,240,0.25),inset_0_1px_0_rgba(124,106,240,0.15)]',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold dark:text-card-text-primary', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm dark:text-card-text-secondary', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
