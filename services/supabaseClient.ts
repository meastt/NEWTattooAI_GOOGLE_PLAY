// This file configures the Supabase client.
// The Supabase library is loaded globally from a <script> tag in index.html.
// @ts-nocheck

// --- USER ACTION REQUIRED ---
// Replace with your actual Supabase project URL and public anon key.
// You can find these in your Supabase project's API settings.
const SUPABASE_URL = "https://zflkdyuswpegqabkwlgw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmbGtkeXVzd3BlZ3FhYmt3bGd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MzAyNDEsImV4cCI6MjA3MjUwNjI0MX0.VyAjSGVjKRWtraecEAFe2kJ3OfGyIRmlN5j_9e7ImBM";

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
