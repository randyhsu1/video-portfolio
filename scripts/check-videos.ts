import { supabase } from '../lib/supabase'

async function checkVideos() {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log('Total videos:', data?.length)
  console.log('Videos:', JSON.stringify(data, null, 2))
}

checkVideos()
