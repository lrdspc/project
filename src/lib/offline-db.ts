/**
 * Banco de dados local usando Dexie.js para funcionalidade offline
 * Implementa armazenamento local para todas as entidades principais do sistema
 */
import Dexie, { Table } from 'dexie';
import { v4 as uuidv4 } from 'uuid';
import type { 
  Client, 
  Inspection, 
  InspectionTile, 
  Nonconformity, 
  InspectionPhoto, 
  SyncQueue 
} from '../types/offline-types';
import { useState, useEffect } from 'react';

// Tipos para os métodos de salvamento
type ClientInput = Omit<Client, 'id' | 'created_at' | 'updated_at' | 'synced'>;
type InspectionInput = Omit<Inspection, 'id' | 'created_at' | 'updated_at' | 'synced'>;
type TileInput = Omit<InspectionTile, 'id' | 'synced'>;
type NonconformityInput = Omit<Nonconformity, 'id' | 'created_at' | 'synced'>;
type PhotoInput = Omit<InspectionPhoto, 'id' | 'created_at' | 'synced' | 'photo_data'>;

/**
 * Classe do banco de dados local
 * Estende Dexie e define as tabelas e índices
 */
class OfflineDatabase extends Dexie {
  clients!: Table<Client, string>;
  inspections!: Table<Inspection, string>;
  inspectionTiles!: Table<InspectionTile, string>;
  nonconformities!: Table<Nonconformity, string>;
  inspectionPhotos!: Table<InspectionPhoto, string>;
  syncQueue!: Table<SyncQueue, number>;

  constructor() {
    super('BrasilitOfflineDB');
    
    this.version(1).stores({
      clients: 'id, name, type, city, state, synced',
      inspections: 'id, client_id, status, inspection_date, synced',
      inspectionTiles: 'id, inspection_id, synced',
      nonconformities: 'id, inspection_id, synced',
      inspectionPhotos: 'id, inspection_id, nonconformity_id, category, synced',
      syncQueue: '++id, operation, table, record_id, attempts, created_at'
    });
  }
  
  /**
   * Salva um cliente no banco de dados local
   * @param clientData Dados do cliente a ser salvo
   * @returns ID do cliente salvo
   */
  async saveClient(clientData: ClientInput): Promise<string> {
    const now = new Date().toISOString();
    const id = uuidv4();
    
    const client: Client = {
      id,
      name: clientData.name,
      type: clientData.type,
      address: clientData.address,
      city: clientData.city,
      state: clientData.state,
      zip_code: clientData.zip_code,
      contact_name: clientData.contact_name || null,
      contact_phone: clientData.contact_phone || null,
      contact_email: clientData.contact_email || null,
      created_at: now,
      updated_at: now,
      synced: false
    };
    
    await this.clients.put(client);
    await addToSyncQueue('clients', 'create', id, client as unknown as Record<string, unknown>);
    
    return id;
  }
  
  /**
   * Atualiza um cliente no banco de dados local
   * @param id ID do cliente
   * @param clientData Dados do cliente a serem atualizados
   */
  async updateClient(id: string, clientData: Partial<ClientInput>): Promise<void> {
    // Verificar se o cliente existe
    const existingClient = await this.clients.get(id);
    if (!existingClient) {
      throw new Error(`Cliente não encontrado: ${id}`);
    }
    
    const updatedClient = {
      ...existingClient,
      ...clientData,
      updated_at: new Date().toISOString(),
      synced: false
    };
    
    await this.clients.update(id, updatedClient);
    await addToSyncQueue('clients', 'update', id, updatedClient as unknown as Record<string, unknown>);
  }
  
  /**
   * Remove um cliente do banco de dados local
   * @param id ID do cliente
   */
  async deleteClient(id: string): Promise<void> {
    // Verificar se o cliente existe
    const existingClient = await this.clients.get(id);
    if (!existingClient) {
      throw new Error(`Cliente não encontrado: ${id}`);
    }
    
    // Verificar se existem inspeções relacionadas
    const relatedInspections = await this.inspections
      .where('client_id')
      .equals(id)
      .count();
    
    if (relatedInspections > 0) {
      throw new Error('Não é possível excluir o cliente pois existem inspeções relacionadas.');
    }
    
    await this.clients.delete(id);
    await addToSyncQueue('clients', 'delete', id, existingClient as unknown as Record<string, unknown>);
  }
  
  /**
   * Salva uma inspeção no banco de dados local
   * @param inspectionData Dados da inspeção a ser salva
   * @returns ID da inspeção salva
   */
  async saveInspection(inspectionData: InspectionInput): Promise<string> {
    const now = new Date().toISOString();
    const id = uuidv4();
    
    const inspection: Inspection = {
      id,
      client_id: inspectionData.client_id,
      status: inspectionData.status,
      inspection_date: inspectionData.inspection_date,
      building_type: inspectionData.building_type,
      construction_year: inspectionData.construction_year || null,
      roof_area: inspectionData.roof_area,
      last_maintenance: inspectionData.last_maintenance || null,
      main_issue: inspectionData.main_issue || null,
      created_at: now,
      updated_at: now,
      synced: false
    };
    
    await this.inspections.put(inspection);
    await addToSyncQueue('inspections', 'create', id, inspection as unknown as Record<string, unknown>);
    
    return id;
  }
  
  /**
   * Atualiza uma inspeção no banco de dados local
   * @param id ID da inspeção
   * @param inspectionData Dados da inspeção a serem atualizados
   */
  async updateInspection(id: string, inspectionData: Partial<InspectionInput>): Promise<void> {
    // Verificar se a inspeção existe
    const existingInspection = await this.inspections.get(id);
    if (!existingInspection) {
      throw new Error(`Inspeção não encontrada: ${id}`);
    }
    
    const updatedInspection = {
      ...existingInspection,
      ...inspectionData,
      updated_at: new Date().toISOString(),
      synced: false
    };
    
    await this.inspections.update(id, updatedInspection);
    await addToSyncQueue('inspections', 'update', id, updatedInspection as unknown as Record<string, unknown>);
  }
  
  /**
   * Remove uma inspeção do banco de dados local
   * @param id ID da inspeção
   */
  async deleteInspection(id: string): Promise<void> {
    // Verificar se a inspeção existe
    const existingInspection = await this.inspections.get(id);
    if (!existingInspection) {
      throw new Error(`Inspeção não encontrada: ${id}`);
    }
    
    // Remover todos os registros relacionados em uma transação
    await this.transaction('rw', 
      [this.inspections, this.inspectionTiles, this.nonconformities, this.inspectionPhotos], 
      async () => {
        // Obter IDs dos registros relacionados para adicionar à fila de sincronização
        const tiles = await this.inspectionTiles.where('inspection_id').equals(id).toArray();
        const nonconformities = await this.nonconformities.where('inspection_id').equals(id).toArray();
        const photos = await this.inspectionPhotos.where('inspection_id').equals(id).toArray();
        
        // Remover registros relacionados
        await this.inspectionTiles.where('inspection_id').equals(id).delete();
        await this.nonconformities.where('inspection_id').equals(id).delete();
        await this.inspectionPhotos.where('inspection_id').equals(id).delete();
        await this.inspections.delete(id);
        
        // Adicionar operações de exclusão à fila de sincronização
        for (const tile of tiles) {
          await addToSyncQueue('inspectionTiles', 'delete', tile.id, tile as unknown as Record<string, unknown>);
        }
        
        for (const nc of nonconformities) {
          await addToSyncQueue('nonconformities', 'delete', nc.id, nc as unknown as Record<string, unknown>);
        }
        
        for (const photo of photos) {
          await addToSyncQueue('inspectionPhotos', 'delete', photo.id, photo as unknown as Record<string, unknown>);
        }
        
        await addToSyncQueue('inspections', 'delete', id, existingInspection as unknown as Record<string, unknown>);
    });
  }
  
  /**
   * Salva uma telha de inspeção no banco de dados local
   * @param tileData Dados da telha a ser salva
   * @returns ID da telha salva
   */
  async saveInspectionTile(tileData: TileInput): Promise<string> {
    const id = uuidv4();
    
    const tile: InspectionTile = {
      id,
      inspection_id: tileData.inspection_id,
      line: tileData.line,
      thickness: tileData.thickness,
      dimensions: tileData.dimensions,
      quantity: tileData.quantity,
      area: tileData.area,
      synced: false
    };
    
    await this.inspectionTiles.put(tile);
    await addToSyncQueue('inspectionTiles', 'create', id, tile as unknown as Record<string, unknown>);
    
    return id;
  }
  
  /**
   * Salva uma não conformidade no banco de dados local
   * @param ncData Dados da não conformidade a ser salva
   * @returns ID da não conformidade salva
   */
  async saveNonconformity(ncData: NonconformityInput): Promise<string> {
    const now = new Date().toISOString();
    const id = uuidv4();
    
    const nonconformity: Nonconformity = {
      id,
      inspection_id: ncData.inspection_id,
      title: ncData.title,
      description: ncData.description,
      notes: ncData.notes || null,
      created_at: now,
      synced: false
    };
    
    await this.nonconformities.put(nonconformity);
    await addToSyncQueue('nonconformities', 'create', id, nonconformity as unknown as Record<string, unknown>);
    
    return id;
  }
  
  /**
   * Salva uma foto de inspeção no banco de dados local
   * @param photoData Dados da foto a ser salva
   * @param base64Data Dados da imagem em base64 (opcional)
   * @returns ID da foto salva
   */
  async saveInspectionPhoto(
    photoData: PhotoInput,
    base64Data?: string
  ): Promise<string> {
    const now = new Date().toISOString();
    const id = uuidv4();
    
    const photo: InspectionPhoto = {
      id,
      inspection_id: photoData.inspection_id,
      nonconformity_id: photoData.nonconformity_id || null,
      category: photoData.category,
      caption: photoData.caption,
      photo_url: photoData.photo_url,
      photo_data: base64Data,
      created_at: now,
      synced: false
    };
    
    await this.inspectionPhotos.put(photo);
    await addToSyncQueue('inspectionPhotos', 'create', id, photo as unknown as Record<string, unknown>);
    
    return id;
  }
}

// Instância única do banco de dados
export const offlineDB = new OfflineDatabase();

/**
 * Hook para verificar o status da conexão
 * @returns Estado atual da conexão
 */
export function useConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline
  };
}

/**
 * Adiciona um item à fila de sincronização
 * @param table Nome da tabela
 * @param operation Tipo de operação (create, update, delete)
 * @param recordId ID do registro
 * @param data Dados do registro
 */
export async function addToSyncQueue(
  table: string,
  operation: 'create' | 'update' | 'delete',
  recordId: string,
  data: Record<string, unknown>
) {
  await offlineDB.syncQueue.add({
    operation,
    table,
    record_id: recordId,
    data: JSON.stringify(data),
    created_at: new Date().toISOString(),
    attempts: 0
  });
}

/**
 * Limpa todos os dados do banco de dados local
 * Útil para operações de logout ou reset
 */
export async function clearOfflineData(): Promise<void> {
  await offlineDB.transaction('rw', 
    [
      offlineDB.clients, 
      offlineDB.inspections, 
      offlineDB.inspectionTiles, 
      offlineDB.nonconformities, 
      offlineDB.inspectionPhotos, 
      offlineDB.syncQueue
    ], 
    async () => {
      await offlineDB.clients.clear();
      await offlineDB.inspections.clear();
      await offlineDB.inspectionTiles.clear();
      await offlineDB.nonconformities.clear();
      await offlineDB.inspectionPhotos.clear();
      await offlineDB.syncQueue.clear();
    }
  );
}

/**
 * Verifica se há alterações pendentes no banco de dados local
 * @returns Verdadeiro se houver alterações pendentes
 */
export async function hasPendingChanges(): Promise<boolean> {
  const count = await offlineDB.syncQueue.count();
  return count > 0;
} 