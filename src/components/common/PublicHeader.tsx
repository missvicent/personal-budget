import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'
import { AccountUserButton } from '@/components/common/AccountUserButton'

export default function PublicHeader() {
  return (
    <header
      className="border-landing-line sticky top-0 z-40 w-full border-b backdrop-blur-md"
      style={{
        background:
          'linear-gradient(180deg, oklch(0.158 0.014 290 / 0.86), oklch(0.158 0.014 290 / 0.55))',
      }}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-7">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <img
            src="/logo.svg"
            alt="Personal Budget"
            className="border-landing-line-2 h-11 w-11 rounded-xl border"
            style={{
              boxShadow: '0 6px 18px -10px var(--landing-accent-glow)',
            }}
          />
          <div className="hidden flex-col justify-center sm:flex">
            <h1 className="landing-display text-landing-text text-lg leading-tight">
              Personal Budget
            </h1>
            <p className="text-landing-faint mt-px text-xs whitespace-nowrap">
              Budget friendly, life ready
            </p>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-3">
          <SignedIn>
            <Link
              to="/overview"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold whitespace-nowrap text-white shadow-[0_1px_0_oklch(1_0_0/0.18)_inset,0_12px_30px_-12px_var(--landing-accent-glow)] transition-all hover:-translate-y-px"
              style={{
                background:
                  'linear-gradient(180deg, var(--landing-accent), var(--landing-accent-press))',
              }}
            >
              Go to Dashboard
            </Link>
            <AccountUserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="border-landing-line-2 text-landing-text hidden cursor-pointer rounded-full border bg-[oklch(1_0_0/0.03)] px-6 py-3 text-base font-semibold whitespace-nowrap backdrop-blur-sm transition-colors hover:bg-[oklch(1_0_0/0.07)] sm:inline-flex">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                className="inline-flex cursor-pointer items-center gap-[9px] rounded-full px-6 py-3 text-base font-semibold whitespace-nowrap text-white shadow-[0_1px_0_oklch(1_0_0/0.18)_inset,0_12px_30px_-12px_var(--landing-accent-glow)] transition-all hover:-translate-y-px"
                style={{
                  background:
                    'linear-gradient(180deg, var(--landing-accent), var(--landing-accent-press))',
                }}
              >
                Start Now
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}
