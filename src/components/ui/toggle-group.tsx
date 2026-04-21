"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const toggleGroupVariants = cva(
  "inline-flex items-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      shape: {
        pills: [
          "gap-1 rounded-full border bg-white p-1 shadow-xs dark:bg-input/30",
          "[&>*]:rounded-full [&>*]:!h-8 [&>*]:!min-w-0 [&>*]:px-4 [&>*]:transition-colors",
          "[&>*[data-state=on]]:!bg-sidebar-primary [&>*[data-state=on]]:!text-sidebar-primary-foreground",
          "[&>*[data-state=on]]:ring-2 [&>*[data-state=on]]:ring-primary [&>*[data-state=on]]:ring-offset-0",
        ],
        segmented: [
          "justify-center overflow-hidden rounded-md border bg-white shadow-xs dark:bg-input/30",
          "[&>*]:!h-10 [&>*]:!rounded-none [&>*]:!border-0 [&>*]:!shadow-none",
          "[&>*:not(:last-child)]:!border-r [&>*:not(:last-child)]:!border-border",
        ],
      },
    },
    defaultVariants: {
      shape: "pills",
    },
  }
)

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants> &
    VariantProps<typeof toggleGroupVariants>
>(({ className, variant, size, shape, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn(toggleGroupVariants({ shape }), className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem, toggleGroupVariants }
