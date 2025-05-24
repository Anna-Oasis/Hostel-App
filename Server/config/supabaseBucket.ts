import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

const SUPABASE_PROJECT_URL = process.env.SUPABASE_PROJECT_URL
const SUPABASE_PUBLIC_ANON_KEY = process.env.SUPABASE_PUBLIC_ANON_KEY
const SUPABASE_BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME


if (!SUPABASE_PROJECT_URL || !SUPABASE_PUBLIC_ANON_KEY || !SUPABASE_BUCKET_NAME) {
  throw new Error(
    'Missing Supabase configuration. Please check SUPABASE_PROJECT_URL, SUPABASE_PUBLIC_ANON_KEY, and SUPABASE_BUCKET_NAME in your environment variables.'
  )
}

const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_PUBLIC_ANON_KEY)
export const supabaseBucket = supabase.storage.from(SUPABASE_BUCKET_NAME)