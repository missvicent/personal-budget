import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'

export default function PublicHeader() {
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

      <div className="z-10 flex shrink-0 items-center gap-4">
        <SignedIn>
          <Link
            to="/dashboard"
            className="rounded-full bg-purple-600 px-6 py-2 font-medium transition-colors hover:bg-purple-500"
          >
            Go to Dashboard
          </Link>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="rounded-full bg-purple-600 px-6 py-2 font-medium transition-colors hover:bg-purple-500">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  )
}
