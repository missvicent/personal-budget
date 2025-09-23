import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { supabase } from '../lib/supabaseClient'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    async function testConnection() {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')

      if (error) {
        console.error('Error:', error)
      } else {
        console.log('Profiles:', profiles)
      }
    }

    testConnection()
  }, [])

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <main>
        <h1>Hello World</h1>
      </main>
    </GoogleOAuthProvider>
  )
}
