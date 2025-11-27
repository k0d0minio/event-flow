#!/usr/bin/env node
/**
 * Script to verify admin users can log in
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mccfvufdnlqikkbmthim.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jY2Z2dWZkbmxxaWtrYm10aGltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDIwMTY5NiwiZXhwIjoyMDc5Nzc3Njk2fQ.7IR3-Me90Cd7u7cke_-JeeBp2SbPsxn3QijS9l11wus'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const ADMIN_USERS = [
  { email: 'jamie@flowstage.com', password: 'FlowStage2025' },
  { email: 'floriane@flowstage.com', password: 'FlowStage2025' },
]

async function verifyAdminUsers() {
  console.log('Verifying admin users...\n')

  for (const { email, password } of ADMIN_USERS) {
    try {
      // Test login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error(`✗ ${email}: Login failed - ${error.message}`)
        continue
      }

      if (!data.user) {
        console.error(`✗ ${email}: No user data returned`)
        continue
      }

      console.log(`✓ ${email}: Login successful (ID: ${data.user.id})`)

      // Check profile role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.error(`✗ ${email}: Failed to fetch profile - ${profileError.message}`)
        continue
      }

      if (profile?.role === 'admin') {
        console.log(`✓ ${email}: Profile role is 'admin'`)
      } else {
        console.error(`✗ ${email}: Profile role is '${profile?.role}', expected 'admin'`)
      }
    } catch (error) {
      console.error(`✗ ${email}: Unexpected error -`, error)
    }
    console.log('')
  }

  console.log('Verification complete!')
}

verifyAdminUsers().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

