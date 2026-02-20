import { StrictMode } from 'react'
import { ClerkProvider } from '@clerk/clerk-react'
import ReactDOM from 'react-dom/client'

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Toaster, toast } from 'sonner'
import { SupabaseProvider } from './contexts/SupabaseContext.tsx'
import { AppRouter } from './Router.tsx'
import { UserSync } from './components/user/UserSync.tsx'

import { getErrorMessage } from './lib/error.ts'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import './styles.css'

const rootElement = document.getElementById('app')

if (rootElement && !rootElement.innerHTML) {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        toast.error(getErrorMessage(error))
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        toast.error(getErrorMessage(error))
      },
    }),
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
                <Toaster />
              </ThemeProvider>
            </UserSync>
          </QueryClientProvider>
        </SupabaseProvider>
      </ClerkProvider>
    </StrictMode>,
  )
}
