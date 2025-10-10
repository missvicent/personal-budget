import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { supabase } from '../lib/supabaseClient'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
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

  return <div>Personal Budget</div>
}
