import { supabase } from '../lib/supabase'

async function createAdmin() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@example.com',
    password: 'admin123456'
  })

  if (error) {
    console.error('Error creating admin:', error)
    return
  }

  console.log('Admin created successfully:', data)
}

createAdmin()
