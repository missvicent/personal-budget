import { UserButton } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'

export default function AppHeader() {
  const linkClasses =
    'py-1 hover:text-purple-300 transition-colors [&.active]:border-b-2 [&.active]:border-purple-500'

  return (
    <header className="relative flex w-full items-center justify-between bg-purple-950/30 px-6 py-5 text-white shadow-lg backdrop-blur-sm">
      <Link to="/" className="z-10 flex shrink-0 items-center gap-4">
        <img src="/logo.svg" alt="BudgetApp" className="h-14 w-14 rounded-xl" />
        <div className="hidden flex-col justify-center sm:flex">
          <h1 className="font-boldleading-tight text-xl">Personal Budget</h1>
          <p className="text-sm leading-tight text-purple-300/70">
            Budget friendly, life ready
          </p>
        </div>
      </Link>
      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex">
        <ul className="flex list-none items-center gap-8 font-medium lg:gap-12">
          <li className="flex items-center">
            <Link
              to="/dashboard"
              className={linkClasses}
              activeProps={{ className: 'active' }}
            >
              Dashboard
            </Link>
          </li>
          <li className="flex items-center">
            <Link
              to="/budget"
              className={linkClasses}
              activeProps={{ className: 'active' }}
            >
              Budget
            </Link>
          </li>
          <li className="flex items-center">
            <Link
              to="/profile"
              className={linkClasses}
              activeProps={{ className: 'active' }}
            >
              Profile
            </Link>
          </li>
        </ul>
      </nav>

      <div className="z-10 flex shrink-0 items-center gap-4">
        <UserButton />
      </div>
    </header>
  )
}
