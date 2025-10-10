import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'

export default function Header() {
  const classes = 'hover:text-gray-300 active:text-gray-300'

  return (
    <header className="p-4 flex w-full text-white items-center justify-between">
      <div className="flex items-center gap-2">
        <Link to="/">
          <img src="/logo.svg" alt="BudgetApp" className="w-8 h-8" />
        </Link>
      </div>

      <nav className="hidden md:flex flex-1 justify-center">
        <ul className="flex gap-6 lg:gap-12 font-bold list-none">
          <SignedIn>
            <li>
              <Link className={classes} to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li>
              <Link className={classes} to="/budget">
                Budget
              </Link>
            </li>
            <li>
              <Link className={classes} to="/profile">
                Profile
              </Link>
            </li>
          </SignedIn>
        </ul>
      </nav>

      <div className="flex items-center gap-4">
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
