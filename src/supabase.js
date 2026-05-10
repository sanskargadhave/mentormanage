import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://etotjdwbarivaxvwufpn";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0b3RqZHdiYXJpdmF4dnd1ZnBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDA0MjIsImV4cCI6MjA5MTAxNjQyMn0.v8kZlTBv8ffM24MDdwUI6qegmAkCq6MSiJ6haoxepYo";

export const supabase = createClient(
   supabaseUrl,
   supabaseAnonKey
);