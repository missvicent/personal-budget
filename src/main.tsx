import { StrictMode } from 'react'
import { ClerkProvider } from '@clerk/clerk-react'
import ReactDOM from 'react-dom/client'

import * as Sentry from '@sentry/react'
import { SupabaseProvider } from './contexts/SupabaseContext.tsx'
import { AppRouter } from './Router.tsx'
import { UserSync } from './components/user/UserSync.tsx'

import { ThemeProvider } from './contexts/ThemeContext.tsx'

import './styles.css'
import { TanstackQueryClientProvider } from './contexts/QueryClientContext.tsx'
import { Toaster } from '@/components/ui/sonner'

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN

  if (!PUBLISHABLE_KEY) throw new Error('Missing Publishable Key')

  Sentry.init({
    dsn: SENTRY_DSN,
    sendDefaultPii: true,
  })

  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        signInFallbackRedirectUrl="/overview"
        signUpFallbackRedirectUrl="/overview"
      >
        <SupabaseProvider>
          <TanstackQueryClientProvider>
            <UserSync>
              <ThemeProvider>
                <AppRouter />
                <Toaster />
              </ThemeProvider>
            </UserSync>
          </TanstackQueryClientProvider>
        </SupabaseProvider>
      </ClerkProvider>
    </StrictMode>,
  )
}
