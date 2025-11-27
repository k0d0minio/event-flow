#!/usr/bin/env tsx
/**
 * Script to create admin users in Supabase
 * 
 * Usage:
 *   SUPABASE_URL=<url> SUPABASE_SERVICE_ROLE_KEY=<key> tsx supabase/scripts/create_admin_users.ts
 * 
 * Or set environment variables in .env.local
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set')
  console.error('SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗')
  process.exit(1)
}

// Create admin client with service role key (bypasses RLS)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const ADMIN_USERS = [
  { email: 'jamie@flowstage.com', password: 'FlowStage2025' },
  { email: 'floriane@flowstage.com', password: 'FlowStage2025' },
]

async function createAdminUsers() {
  console.log('Creating admin users...\n')

  for (const { email, password } of ADMIN_USERS) {
    try {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find((u) => u.email === email)

      if (existingUser) {
        console.log(`User ${email} already exists. Updating profile to admin role...`)
        
        // Update profile to admin role
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: existingUser.id,
            role: 'admin',
          }, {
            onConflict: 'id',
          })

        if (profileError) {
          console.error(`Error updating profile for ${email}:`, profileError.message)
        } else {
          console.log(`✓ Profile updated for ${email}`)
        }

        // Optionally update password if needed
        // Uncomment if you want to reset the password
        // const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
        //   existingUser.id,
        //   { password }
        // )
        // if (passwordError) {
        //   console.error(`Error updating password for ${email}:`, passwordError.message)
        // } else {
        //   console.log(`✓ Password updated for ${email}`)
        // }
      } else {
        // Create new user
        console.log(`Creating user ${email}...`)
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // Auto-confirm email
        })

        if (createError) {
          console.error(`Error creating user ${email}:`, createError.message)
          continue
        }

        if (!newUser.user) {
          console.error(`Error: User object not returned for ${email}`)
          continue
        }

        console.log(`✓ User created: ${email} (ID: ${newUser.user.id})`)

        // Create profile with admin role
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: newUser.user.id,
            role: 'admin',
          }, {
            onConflict: 'id',
          })

        if (profileError) {
          console.error(`Error creating profile for ${email}:`, profileError.message)
        } else {
          console.log(`✓ Admin profile created for ${email}`)
        }
      }
    } catch (error) {
      console.error(`Unexpected error for ${email}:`, error)
    }
    console.log('')
  }

  console.log('Done!')
}

createAdminUsers().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

