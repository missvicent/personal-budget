import ThemeToggle from './ThemeToggle'

export default function AppToolbar() {
  return (
    <header className="dark:bg-sidebar border-sidebar-border flex h-[72px] shrink-0 items-center border-b-2">
      <div className="dark:bg-sidebar-accent flex w-full items-center justify-end gap-2 p-4">
        <ThemeToggle />
      </div>
    </header>
  )
}
