import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração da conexão
const pool = new Pool({
  connectionString: 'postgresql://postgres.xlelxwhswkwvioyshvoq:u3aRsNCaShs2hME2@aws-0-sa-east-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function executeMigration(filePath) {
  console.log(`Executando migração: ${filePath}`);
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('COMMIT');
      console.log(`Migração ${filePath} executada com sucesso!`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`Erro na migração ${filePath}:`, err);
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(`Erro ao ler ou executar ${filePath}:`, err);
    throw err;
  }
}

async function setupDatabase() {
  const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // para garantir ordem de execução

  console.log('Arquivos de migração encontrados:', migrationFiles);

  for (const file of migrationFiles) {
    await executeMigration(path.join(migrationsDir, file));
  }

  console.log('Todas as migrações foram executadas!');
  pool.end();
}

setupDatabase().catch(err => {
  console.error('Erro ao configurar o banco de dados:', err);
  process.exit(1);
}); 