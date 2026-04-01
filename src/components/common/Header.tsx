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
    <header className="relative flex w-full items-center justify-between bg-purple-950/30 px-6 py-5 text-white shadow-lg backdrop-blur-sm">
      <Link to="/" className="z-10 flex shrink-0 items-center gap-4">
        <img
          src="/logo.svg"
          alt="Personal Budget"
          className="h-14 w-14 rounded-xl"
        />
        <div className="hidden flex-col justify-center sm:flex">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Personal Budget
          </h1>
          <p className="text-xs font-medium tracking-wide text-purple-300/70">
            Budget friendly, life ready
          </p>
        </div>
      </Link>

      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex">
        <ul className="flex list-none items-center gap-8 font-medium lg:gap-12">
          <SignedIn>
            <li className="flex items-center">
              <Link
                to="/overview"
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

      <div className="z-10 flex shrink-0 items-center gap-4">
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
