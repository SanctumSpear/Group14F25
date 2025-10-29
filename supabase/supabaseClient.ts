import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://your-supabase-url.supabase.co"; // Replace with your Supabase URL
const supabaseKey = "your-supabase-key"; // Replace with your Supabase key

export const supabase = createClient(supabaseUrl, supabaseKey);