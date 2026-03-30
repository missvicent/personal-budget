import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'

export default function PublicHeader() {
  return (
    <header className="relative flex w-full items-center justify-between bg-slate-950/60 px-6 py-5 text-white shadow-lg backdrop-blur-sm">
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
          <p className="text-xs font-medium tracking-wide text-slate-400/70">
            Budget friendly, life ready
          </p>
        </div>
      </Link>

      <div className="z-10 flex shrink-0 items-center gap-4">
        <SignedIn>
          <Link
            to="/budget/overview"
            className="rounded-full bg-violet-600 px-6 py-2 font-medium transition-colors hover:bg-violet-500"
          >
            Go to Dashboard
          </Link>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="rounded-full bg-violet-600 px-6 py-2 font-medium transition-colors hover:bg-violet-500">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  )
}
