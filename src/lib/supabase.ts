import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xrxnmaelhxjwghttxsfe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyeG5tYWVsaHhqd2dodHR4c2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MzAyODksImV4cCI6MjA5NTAwNjI4OX0.pptduwjoTf4xmiqCslhOBdB1lH7kuSqgZXUrderPC8w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
