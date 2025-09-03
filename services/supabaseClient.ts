// This file configures the Supabase client.
// The Supabase library is loaded globally from a <script> tag in index.html.
// @ts-nocheck

// --- USER ACTION REQUIRED ---
// Replace with your actual Supabase project URL and public anon key.
// You can find these in your Supabase project's API settings.
const SUPABASE_URL = "YOUR_SUPABASE_URL"; // e.g., "https://xyz.supabase.co"
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY"; // e.g., "ey..."

// Initialize the client only if the placeholder values have been changed.
// The app will function without these, but database features (saving, gallery) will be disabled.
export const supabase = (SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY")
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Add a console warning if the placeholders are still being used.
if (!supabase) {
    console.warn("Supabase credentials are not set in services/supabaseClient.ts. Database features will be disabled. Please add your project URL and anon key.");
}
