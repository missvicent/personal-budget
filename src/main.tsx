import { StrictMode } from 'react'
import { ClerkProvider } from '@clerk/clerk-react'
import ReactDOM from 'react-dom/client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SupabaseProvider } from './contexts/SupabaseContext.tsx'
import { AppRouter } from './Router.tsx'
import { UserSync } from './components/user/UserSync.tsx'

import './styles.css'
import { ThemeProvider } from './contexts/ThemeContext.tsx'

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
      },
    },
  })

  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  if (!PUBLISHABLE_KEY) throw new Error('Missing Publishable Key')

  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <SupabaseProvider>
          <QueryClientProvider client={queryClient}>
            <UserSync>
              <ThemeProvider>
                <AppRouter />
              </ThemeProvider>
            </UserSync>
          </QueryClientProvider>
        </SupabaseProvider>
      </ClerkProvider>
    </StrictMode>,
  )
}
