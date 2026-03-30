import * as React from 'react'

import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

const cardVariants = cva(
  'flex flex-col gap-2 rounded-xl py-6 text-card-foreground transition-shadow duration-200',
  {
    variants: {
      variant: {
        default: [
          'bg-white border border-black/[0.04]',
          'shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
          'hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]',
          'dark:bg-white/[0.05] dark:border-white/[0.08] dark:shadow-none',
          'dark:hover:bg-white/[0.07] dark:hover:border-white/[0.12]',
        ],
        dashed: [
          'bg-white border-2 border-dashed border-brand/60 text-brand',
          'shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
          'hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]',
          'dark:bg-white/[0.05]',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface CardProps extends React.ComponentProps<'div'>, VariantProps<typeof cardVariants> { }

function Card({ className, variant, ...props }: CardProps) {

  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, className }))}
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
