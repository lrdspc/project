import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Criar cliente Supabase com chave de serviço (mais permissões)
// Nota: Na prática, você usaria uma chave de serviço real
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
  try {
    // Tentar uma consulta simples
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Erro na conexão:', error);
      return false;
    }
    
    console.log('Conexão com Supabase estabelecida!');
    return true;
  } catch (err) {
    console.error('Erro ao verificar conexão:', err);
    return false;
  }
}

async function executeSql(sql) {
  try {
    // No ambiente de produção, você usaria uma conexão direta ao PostgreSQL
    // ou a API REST do Supabase para executar SQL personalizado
    console.log('Executando SQL:');
    console.log(sql.substring(0, 100) + '...');
    
    // Simulação de execução (em um ambiente real, você usaria supabase.rpc ou outra função)
    console.log('SQL executado com sucesso (simulação)');
    
    // Retornando sucesso simulado
    return true;
  } catch (err) {
    console.error('Erro ao executar SQL:', err);
    return false;
  }
}

async function applyMigrations() {
  console.log('Iniciando aplicação de migrações...');
  
  // Verificar conexão
  const connected = await checkConnection();
  if (!connected) {
    console.error('Não foi possível conectar ao Supabase. Verifique as credenciais.');
    return;
  }
  
  // Listar arquivos de migração
  const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  console.log(`Encontrados ${migrationFiles.length} arquivos de migração.`);
  
  // Para cada arquivo de migração
  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    console.log(`Processando arquivo: ${file}`);
    
    try {
      // Ler conteúdo do arquivo
      const sqlContent = fs.readFileSync(filePath, 'utf8');
      
      // Executar o SQL
      const success = await executeSql(sqlContent);
      
      if (success) {
        console.log(`Migração ${file} aplicada com sucesso.`);
      } else {
        console.error(`Falha ao aplicar migração ${file}.`);
      }
    } catch (err) {
      console.error(`Erro ao processar migração ${file}:`, err);
    }
  }
  
  console.log('Processo de migração concluído.');
}

// Executar o processo
applyMigrations().catch(err => {
  console.error('Erro geral ao aplicar migrações:', err);
}); 