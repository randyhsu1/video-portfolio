import { supabase } from './supabase'

export type Video = {
  id: number
  title: string
  description: string
  category: string
  video_url: string
  thumbnail_url: string
  created_at: string
}

export async function fetchVideosByCategory(category: string): Promise<Video[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function addVideo(video: Omit<Video, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('videos')
    .insert([video])
    .select()
  if (error) throw error
  return data?.[0]
}
