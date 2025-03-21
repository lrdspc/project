import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Ler variáveis do arquivo .env
const envFile = fs.readFileSync('./.env', 'utf8');
const envVars = envFile.split('\n').reduce((acc, line) => {
  if (line && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
  }
  return acc;
}, {});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

console.log('Usando URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  try {
    const { data, error } = await supabase
      .from('pg_tables')
      .select('schemaname, tablename')
      .eq('schemaname', 'public');

    if (error) {
      console.error('Erro ao listar tabelas:', error);
      return;
    }

    console.log('Tabelas encontradas:');
    if (data && data.length > 0) {
      data.forEach(table => {
        console.log(`- ${table.tablename}`);
      });
    } else {
      console.log('Nenhuma tabela encontrada no schema public');
    }
  } catch (err) {
    console.error('Erro na conexão:', err);
  }
}

listTables(); 