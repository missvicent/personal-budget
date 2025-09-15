import { createFileRoute } from '@tanstack/react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <main>
        <h1>Hello World</h1>
      </main>
    </GoogleOAuthProvider>
  )
}
