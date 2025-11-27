import { StrictMode } from 'react'
import { ClerkProvider } from '@clerk/clerk-react'
import ReactDOM from 'react-dom/client'

import { AppRouter } from './Router.tsx'

import './styles.css'

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  if (!PUBLISHABLE_KEY) throw new Error('Missing Publishable Key')

  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <AppRouter />
      </ClerkProvider>
    </StrictMode>,
  )
}
