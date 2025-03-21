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

async function testConnection() {
  try {
    // Testar uma consulta simples
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Erro na consulta:', error);
      
      // Tentar obter a versão do banco
      const { data: versionData, error: versionError } = await supabase
        .rpc('version')
        .single();
        
      if (versionError) {
        console.error('Erro ao obter versão:', versionError);
      } else {
        console.log('Versão do PostgreSQL:', versionData);
      }
      
      return;
    }

    console.log('Conexão bem-sucedida!');
    console.log('Dados obtidos:', data);

    // Se não houver tabelas, perguntar se deseja criar
    if (data && data.length === 0) {
      console.log('Nenhum registro na tabela clients. Talvez precise inicializar o banco de dados.');
    }
  } catch (err) {
    console.error('Erro na conexão:', err);
  }
}

testConnection(); 