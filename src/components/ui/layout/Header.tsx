import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'

export default function Header() {
  const linkClasses =
    'py-1 hover:text-purple-300 transition-colors [&.active]:border-b-2 [&.active]:border-purple-500'
  return (
    <header className="relative w-full bg-purple-950/30 backdrop-blur-sm px-6 py-5 flex text-white items-center justify-between shadow-lg">
      <Link to="/" className="flex items-center gap-4 shrink-0 z-10">
        <img src="/logo.svg" alt="BudgetApp" className="w-14 h-14 rounded-xl" />
        <div className="hidden sm:flex flex-col justify-center">
          <h1 className="text-xl font-boldleading-tight">Personal Budget</h1>
          <p className="text-sm text-purple-300/70 leading-tight">
            Budget friendly, life ready
          </p>
        </div>
      </Link>

      <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center">
        <ul className="flex gap-8 lg:gap-12 font-medium list-none items-center">
          <SignedIn>
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
          </SignedIn>
        </ul>
      </nav>

      <div className="flex items-center gap-4 shrink-0 z-10">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  )
}
