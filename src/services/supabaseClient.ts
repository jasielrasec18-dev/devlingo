import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '❌ Supabase URL ou Publishable Key não configurados!\n' +
    'Configure as variáveis de ambiente:\n' +
    '- VITE_SUPABASE_URL\n' +
    '- VITE_SUPABASE_PUBLISHABLE_KEY'
  );
}

// Criar cliente Supabase
// Se as variáveis não estiverem configuradas, usa valores placeholder
// Isso evita que o app quebre, mas as chamadas falharão
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
);
