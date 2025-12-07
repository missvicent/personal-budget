import { StrictMode } from 'react'
import { ClerkProvider } from '@clerk/clerk-react'
import ReactDOM from 'react-dom/client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from './Router.tsx'
import { UserSync } from './components/user/UserSync.tsx'

import './styles.css'

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const queryClient = new QueryClient()

  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  if (!PUBLISHABLE_KEY) throw new Error('Missing Publishable Key')

  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <UserSync>
            <AppRouter />
          </UserSync>
        </QueryClientProvider>
      </ClerkProvider>
    </StrictMode>,
  )
}
