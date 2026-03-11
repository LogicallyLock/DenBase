// Validates that required environment variables are set
export function checkSupabaseEnv() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.error(
      "⚠️ Missing environment variables!\n\n" +
      "Create a .env file in the project root with:\n\n" +
      'VITE_SUPABASE_URL="your-supabase-url"\n' +
      'VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"\n' +
      'VITE_SUPABASE_PROJECT_ID="your-project-id"\n\n' +
      "See README.md for details."
    );
    return false;
  }
  return true;
}
