import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fcjuuflfsujlcrugideq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjanV1Zmxmc3VqbGNydWdpZGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwODc4MDksImV4cCI6MjA2MTY2MzgwOX0.fW5byLtcNrQfasz-ihtDb9vTk1MbtzF95vBwfgYMfcg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
