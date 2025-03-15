/**
 * Serviço de sincronização entre o banco de dados local e o Supabase
 * Gerencia a sincronização de dados quando o dispositivo está online/offline
 */
import { supabase } from './supabase';
import Dexie from 'dexie';
import { offlineDB } from './offline-db';

// Intervalo de sincronização em milissegundos (30 segundos)
const SYNC_INTERVAL = 30000;

// Flag para controlar se a sincronização está em andamento
let isSyncing = false;

/**
 * Inicializa o serviço de sincronização
 * Configura listeners para eventos online/offline e inicia o intervalo de sincronização
 */
export function initSyncService() {
  // Adicionar listeners para eventos de conectividade
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Iniciar intervalo de sincronização
  const syncInterval = setInterval(syncIfOnline, SYNC_INTERVAL);
  
  // Função de limpeza para remover listeners e intervalo
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
    clearInterval(syncInterval);
  };
}

/**
 * Manipulador para evento online
 * Tenta sincronizar dados quando o dispositivo fica online
 */
function handleOnline() {
  console.log('Dispositivo está online. Iniciando sincronização...');
  syncData();
}

/**
 * Manipulador para evento offline
 * Registra quando o dispositivo fica offline
 */
function handleOffline() {
  console.log('Dispositivo está offline. Operações serão armazenadas localmente.');
}

/**
 * Verifica se o dispositivo está online e inicia a sincronização
 */
function syncIfOnline() {
  if (navigator.onLine && !isSyncing) {
    syncData();
  }
}

/**
 * Sincroniza dados entre o banco de dados local e o Supabase
 * Processa a fila de sincronização e baixa dados novos do servidor
 */
export async function syncData() {
  if (isSyncing) return;
  
  try {
    isSyncing = true;
    console.log('Iniciando sincronização de dados...');
    
    // 1. Processar fila de sincronização (enviar dados locais para o servidor)
    await processQueue();
    
    // 2. Baixar dados novos do servidor
    await downloadServerData();
    
    console.log('Sincronização concluída com sucesso.');
  } catch (error) {
    console.error('Erro durante a sincronização:', error);
  } finally {
    isSyncing = false;
  }
}

/**
 * Processa a fila de sincronização
 * Envia operações pendentes para o servidor
 */
async function processQueue() {
  // Buscar itens da fila com menos de 5 tentativas
  const queueItems = await offlineDB.syncQueue
    .where('attempts')
    .below(5)
    .toArray();
  
  if (queueItems.length === 0) {
    console.log('Nenhum item na fila de sincronização.');
    return;
  }
  
  console.log(`Processando ${queueItems.length} itens na fila de sincronização.`);
  
  // Processar cada item da fila
  for (const item of queueItems) {
    try {
      const data = JSON.parse(item.data);
      
      switch (item.operation) {
        case 'create':
          await handleCreate(item.table, data);
          break;
        case 'update':
          await handleUpdate(item.table, item.record_id, data);
          break;
        case 'delete':
          await handleDelete(item.table, item.record_id);
          break;
      }
      
      // Remover item da fila após processamento bem-sucedido
      await offlineDB.syncQueue.delete(item.id!);
      
    } catch (error) {
      console.error(`Erro ao processar item ${item.id} da fila:`, error);
      
      // Atualizar contagem de tentativas e registrar erro
      await offlineDB.syncQueue.update(item.id!, {
        attempts: item.attempts + 1,
        last_attempt: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}

/**
 * Manipula operação de criação
 * @param table Nome da tabela
 * @param data Dados a serem inseridos
 */
async function handleCreate(table: string, data: Record<string, unknown>) {
  const { error } = await supabase.from(table).insert(data);
  
  if (error) {
    throw new Error(`Erro ao criar registro em ${table}: ${error.message}`);
  }
}

/**
 * Manipula operação de atualização
 * @param table Nome da tabela
 * @param id ID do registro
 * @param data Dados a serem atualizados
 */
async function handleUpdate(table: string, id: string, data: Record<string, unknown>) {
  const { error } = await supabase.from(table).update(data).eq('id', id);
  
  if (error) {
    throw new Error(`Erro ao atualizar registro em ${table}: ${error.message}`);
  }
}

/**
 * Manipula operação de exclusão
 * @param table Nome da tabela
 * @param id ID do registro
 */
async function handleDelete(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  
  if (error) {
    throw new Error(`Erro ao excluir registro em ${table}: ${error.message}`);
  }
}

/**
 * Baixa dados novos do servidor
 * Atualiza o banco de dados local com dados do Supabase
 */
async function downloadServerData() {
  // Lista de tabelas para sincronizar
  const tables = ['clients', 'inspections', 'inspection_tiles', 'nonconformities', 'inspection_photos'];
  
  for (const table of tables) {
    try {
      await syncTable(table);
    } catch (error) {
      console.error(`Erro ao sincronizar tabela ${table}:`, error);
    }
  }
}

/**
 * Sincroniza uma tabela específica
 * @param tableName Nome da tabela
 */
async function syncTable(tableName: string) {
  console.log(`Sincronizando tabela: ${tableName}`);
  
  // Obter timestamp da última sincronização
  const lastSync = localStorage.getItem(`lastSync_${tableName}`);
  
  // Buscar dados atualizados desde a última sincronização
  const query = supabase.from(tableName).select('*');
  
  if (lastSync) {
    query.gt('updated_at', lastSync);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Erro ao buscar dados de ${tableName}: ${error.message}`);
  }
  
  if (!data || data.length === 0) {
    console.log(`Nenhum dado novo para sincronizar em ${tableName}.`);
    return;
  }
  
  console.log(`Sincronizando ${data.length} registros de ${tableName}.`);
  
  // Mapear nome da tabela para a tabela correspondente no Dexie
  const dexieTableMap: Record<string, unknown> = {
    'clients': offlineDB.clients,
    'inspections': offlineDB.inspections,
    'inspection_tiles': offlineDB.inspectionTiles,
    'nonconformities': offlineDB.nonconformities,
    'inspection_photos': offlineDB.inspectionPhotos
  };
  
  const dexieTable = dexieTableMap[tableName];
  
  if (!dexieTable) {
    throw new Error(`Tabela ${tableName} não encontrada no banco de dados local.`);
  }
  
  // Atualizar ou inserir registros no banco local
  await offlineDB.transaction('rw', dexieTable, async () => {
    for (const record of data) {
      // Marcar como sincronizado
      const recordWithSync = { ...record, synced: true };
      
      // Verificar se o registro já existe
      const existingRecord = await dexieTable.get(record.id);
      
      if (existingRecord) {
        await dexieTable.update(record.id, recordWithSync);
      } else {
        await dexieTable.add(recordWithSync);
      }
    }
  });
  
  // Atualizar timestamp da última sincronização
  localStorage.setItem(`lastSync_${tableName}`, new Date().toISOString());
} 