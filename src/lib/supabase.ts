import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string

// console.log('SUPABASE URL:', supabaseUrl)  // added for testing  Do not add back !!!
// console.log('SUPABASE KEY:', supabaseKey)  // added for testing  Do not add back !!!

export const supabase = createClient(supabaseUrl, supabaseKey)
