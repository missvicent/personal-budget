import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react'

export default function Header() {
  return (
    <header className="p-2 flex gap-2 w-full text-black justify-between">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <header>
            <div>
              <SignedIn>
                <h1>Welcome 🎉</h1>
                <UserButton />
              </SignedIn>

              <SignedOut>
                <SignInButton />
              </SignedOut>
            </div>
          </header>
        </div>
      </nav>
    </header>
  )
}
