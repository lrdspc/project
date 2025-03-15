/**
 * Hook para gerenciar dados offline e sincronização
 * Fornece funções para interagir com o banco de dados local e sincronizar com o servidor
 */
import { useState, useEffect, useCallback } from 'react';
import { 
  offlineDB, 
  clearOfflineData 
} from '../lib/offline-db';
import type { 
  Client,
  Inspection
} from '../types/offline-types';

// Tipo para o status de sincronização
interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: Date | null;
  pendingChanges: number;
  hasError: boolean;
  errorMessage?: string;
}

// Obtém o status online do dispositivo
function getDeviceOnlineStatus() {
  return navigator.onLine;
}

/**
 * Hook para gerenciar o status de conexão e sincronização
 * @returns Funções e estado para gerenciar o modo offline
 */
export function useConnectionStatus() {
  const [isOnline, setIsOnline] = useState(getDeviceOnlineStatus());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: getDeviceOnlineStatus(),
    isSyncing: false,
    lastSync: null,
    pendingChanges: 0,
    hasError: false
  });
  
  // Monitorar mudanças na conectividade
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
  
  // Iniciar sincronização manual
  const syncNow = useCallback(async () => {
    if (!isOnline) {
      throw new Error('Dispositivo offline. Não é possível sincronizar agora.');
    }
    
    try {
      // Implementação da sincronização manual
      setSyncStatus(prev => ({...prev, isSyncing: true, hasError: false}));
      
      // Aqui seria feita a chamada para a sincronização real
      // await forceSyncData();
      
      // Simulando a sincronização para fins de demonstração
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSyncStatus(prev => ({
        ...prev, 
        isSyncing: false, 
        lastSync: new Date(),
        pendingChanges: 0
      }));
      
      return true;
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      setSyncStatus(prev => ({
        ...prev, 
        isSyncing: false, 
        hasError: true,
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido'
      }));
      throw error;
    }
  }, [isOnline]);
  
  return {
    isOnline,
    isSyncing: syncStatus.isSyncing,
    lastSync: syncStatus.lastSync,
    pendingChanges: syncStatus.pendingChanges,
    hasError: syncStatus.hasError,
    errorMessage: syncStatus.errorMessage,
    syncNow,
    lastOnline: syncStatus.lastSync
  };
}

/**
 * Hook para gerenciar clientes offline
 * @returns Funções para gerenciar clientes no banco de dados local
 */
export function useOfflineClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Carregar clientes do banco de dados local
  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      const result = await offlineDB.clients.toArray();
      setClients(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar clientes'));
      console.error('Erro ao carregar clientes:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Carregar clientes inicialmente
  useEffect(() => {
    loadClients();
  }, [loadClients]);
  
  // Salvar um novo cliente
  const saveClient = useCallback(async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'synced'>) => {
    try {
      const id = await offlineDB.saveClient(clientData);
      await loadClients(); // Recarregar a lista
      return id;
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      throw err;
    }
  }, [loadClients]);
  
  // Atualizar um cliente existente
  const updateClient = useCallback(async (id: string, clientData: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at' | 'synced'>>) => {
    try {
      await offlineDB.updateClient(id, clientData);
      await loadClients(); // Recarregar a lista
    } catch (err) {
      console.error('Erro ao atualizar cliente:', err);
      throw err;
    }
  }, [loadClients]);
  
  // Remover um cliente
  const deleteClient = useCallback(async (id: string) => {
    try {
      await offlineDB.deleteClient(id);
      await loadClients(); // Recarregar a lista
    } catch (err) {
      console.error('Erro ao remover cliente:', err);
      throw err;
    }
  }, [loadClients]);
  
  return {
    clients,
    loading,
    error,
    loadClients,
    saveClient,
    updateClient,
    deleteClient
  };
}

/**
 * Hook para gerenciar inspeções offline
 * @returns Funções para gerenciar inspeções no banco de dados local
 */
export function useOfflineInspections() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Carregar inspeções do banco de dados local
  const loadInspections = useCallback(async () => {
    try {
      setLoading(true);
      const result = await offlineDB.inspections.toArray();
      setInspections(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar inspeções'));
      console.error('Erro ao carregar inspeções:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Carregar inspeções inicialmente
  useEffect(() => {
    loadInspections();
  }, [loadInspections]);
  
  // Salvar uma nova inspeção
  const saveInspection = useCallback(async (inspectionData: Omit<Inspection, 'id' | 'created_at' | 'updated_at' | 'synced'>) => {
    try {
      const id = await offlineDB.saveInspection(inspectionData);
      await loadInspections(); // Recarregar a lista
      return id;
    } catch (err) {
      console.error('Erro ao salvar inspeção:', err);
      throw err;
    }
  }, [loadInspections]);
  
  // Obter uma inspeção pelo ID
  const getInspection = useCallback(async (id: string) => {
    try {
      return await offlineDB.inspections.get(id);
    } catch (err) {
      console.error('Erro ao obter inspeção:', err);
      throw err;
    }
  }, []);
  
  // Atualizar uma inspeção existente
  const updateInspection = useCallback(async (id: string, inspectionData: Partial<Omit<Inspection, 'id' | 'created_at' | 'updated_at' | 'synced'>>) => {
    try {
      await offlineDB.updateInspection(id, inspectionData);
      await loadInspections(); // Recarregar a lista
    } catch (err) {
      console.error('Erro ao atualizar inspeção:', err);
      throw err;
    }
  }, [loadInspections]);
  
  // Remover uma inspeção
  const deleteInspection = useCallback(async (id: string) => {
    try {
      await offlineDB.deleteInspection(id);
      await loadInspections(); // Recarregar a lista
    } catch (err) {
      console.error('Erro ao remover inspeção:', err);
      throw err;
    }
  }, [loadInspections]);
  
  return {
    inspections,
    loading,
    error,
    loadInspections,
    saveInspection,
    getInspection,
    updateInspection,
    deleteInspection
  };
}

/**
 * Limpa todos os dados offline e reseta o banco de dados local
 * Útil para operações de logout ou reset de dados
 */
export async function resetOfflineData() {
  try {
    await clearOfflineData();
    return true;
  } catch (error) {
    console.error('Erro ao limpar dados offline:', error);
    throw error;
  }
} 