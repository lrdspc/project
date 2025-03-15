/**
 * Componente para exibir o status de conexão e sincronização
 * Mostra se o dispositivo está online/offline e permite sincronização manual
 */
import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useConnectionStatus } from '../../hooks/useOfflineData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConnectionStatusProps {
  showLastSync?: boolean;
  showSyncButton?: boolean;
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  showLastSync = true,
  showSyncButton = true,
  className = ''
}) => {
  const { isOnline, lastOnline, syncNow } = useConnectionStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  
  // Formatar data da última sincronização
  const formattedLastSync = lastOnline
    ? format(lastOnline, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
    : 'Nunca';
  
  // Iniciar sincronização manual
  const handleSync = async () => {
    if (!isOnline || isSyncing) return;
    
    setIsSyncing(true);
    setSyncError(null);
    
    try {
      await syncNow();
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Erro ao sincronizar');
    } finally {
      setIsSyncing(false);
    }
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      {/* Ícone de status */}
      <div className="mr-2">
        {isOnline ? (
          <Wifi className="h-5 w-5 text-green-500" />
        ) : (
          <WifiOff className="h-5 w-5 text-red-500" />
        )}
      </div>
      
      {/* Texto de status */}
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${isOnline ? 'text-green-700' : 'text-red-700'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
        
        {showLastSync && (
          <span className="text-xs text-gray-500">
            Última sincronização: {formattedLastSync}
          </span>
        )}
        
        {syncError && (
          <span className="text-xs text-red-600">
            {syncError}
          </span>
        )}
      </div>
      
      {/* Botão de sincronização */}
      {showSyncButton && isOnline && (
        <button
          onClick={handleSync}
          disabled={isSyncing || !isOnline}
          className={`ml-3 p-1.5 rounded-full ${
            isSyncing
              ? 'bg-blue-100 text-blue-400'
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          }`}
          title="Sincronizar agora"
        >
          <RefreshCw
            className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`}
          />
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus; 