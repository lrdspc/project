/**
 * Página de Gerenciamento do Modo Offline
 * Permite visualizar e gerenciar dados armazenados localmente quando offline
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Trash2, 
  ChevronRight, 
  Users, 
  FileText, 
  Calendar, 
  AlertTriangle,
  Check,
  X,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useConnectionStatus, useOfflineClients, useOfflineInspections } from '../hooks/useOfflineData';
import { offlineDB } from '../lib/offline-db';
import ConnectionStatus from '../components/ui/ConnectionStatus';

/**
 * Componente de botão simples para a interface offline
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  size = 'default', 
  children, 
  className = '',
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50';
      case 'destructive':
        return 'bg-red-600 text-white hover:bg-red-700';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 px-3 text-xs';
      case 'lg':
        return 'h-12 px-8 text-base';
      default:
        return 'h-10 py-2 px-4 text-sm';
    }
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * Componente principal da página de Modo Offline
 */
const OfflineMode: React.FC = () => {
  const { isOnline, isSyncing, syncNow } = useConnectionStatus();
  const { clients, loading: loadingClients } = useOfflineClients();
  const { inspections, loading: loadingInspections } = useOfflineInspections();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'clients' | 'inspections'>('overview');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleClearData = async () => {
    await offlineDB.delete();
    setShowConfirmClear(false);
    window.location.reload();
  };

  const handleSync = async () => {
    try {
      await syncNow();
      // Aqui poderia aparecer uma notificação de sucesso
    } catch (error) {
      console.error('Erro ao sincronizar dados:', error);
      // Aqui poderia aparecer uma notificação de erro
    }
  };

  // Mapeia o estado de sincronização para o componente
  const syncStatus = isSyncing ? 'syncing' : isOnline ? 'completed' : 'idle';

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modo Offline</h1>
            <p className="text-gray-600">
              Gerencie seus dados armazenados localmente
            </p>
          </div>
          <ConnectionStatus />
        </div>
      </div>

      {/* Indicador de status */}
      <div className={`p-4 rounded-lg mb-6 ${isOnline ? 'bg-green-50' : 'bg-amber-50'}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-400" />
            ) : (
              <WifiOff className="h-5 w-5 text-amber-400" />
            )}
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">
              {isOnline ? 'Conectado' : 'Modo Offline Ativo'}
            </h3>
            <div className="mt-2 text-sm text-gray-700">
              <p>
                {isOnline
                  ? 'Você está online. Todas as alterações são sincronizadas automaticamente com o servidor.'
                  : 'Você está trabalhando offline. Suas alterações serão salvas localmente e sincronizadas quando a conexão for restabelecida.'}
              </p>
            </div>
            {!isOnline && (
              <div className="mt-4">
                <Button
                  onClick={handleSync}
                  disabled={isOnline}
                  size="sm"
                  variant="outline"
                  className="mr-2"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar sincronizar manualmente
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`${
              selectedTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setSelectedTab('clients')}
            className={`${
              selectedTab === 'clients'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Clientes ({clients.length})
          </button>
          <button
            onClick={() => setSelectedTab('inspections')}
            className={`${
              selectedTab === 'inspections'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Vistorias ({inspections.length})
          </button>
        </nav>
      </div>

      {/* Conteúdo da aba */}
      {selectedTab === 'overview' && (
        <div>
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Status da Sincronização
              </h2>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {syncStatus === 'idle' && (
                    <>
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                        <Clock className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700">Aguardando</span>
                    </>
                  )}
                  {syncStatus === 'syncing' && (
                    <>
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                      </div>
                      <span className="text-sm text-blue-700">Sincronizando</span>
                    </>
                  )}
                  {syncStatus === 'completed' && (
                    <>
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm text-green-700">Sincronizado</span>
                    </>
                  )}
                </div>
                <Button
                  onClick={handleSync}
                  disabled={syncStatus === 'syncing'}
                  size="sm"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sincronizar agora
                </Button>
              </div>
              
              {/* Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      Clientes Offline
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold">
                    {loadingClients ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      clients.length
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      Vistorias Offline
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold">
                    {loadingInspections ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      inspections.length
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      Relatórios Pendentes
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold">
                    {loadingInspections ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      inspections.filter(i => i.status === 'completed').length
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ações Offline */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Ações Disponíveis
              </h2>
              <div className="space-y-4">
                <Link 
                  to="/inspections/new" 
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Nova Vistoria</h3>
                      <p className="text-sm text-gray-500">
                        Realize uma nova vistoria mesmo sem conexão
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
                
                <Link 
                  to="/clients/new" 
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Novo Cliente</h3>
                      <p className="text-sm text-gray-500">
                        Cadastre um novo cliente localmente
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
                
                <button 
                  onClick={() => setShowConfirmClear(true)}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 w-full text-left"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Limpar Dados Offline</h3>
                      <p className="text-sm text-gray-500">
                        Remove todos os dados armazenados localmente
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'clients' && (
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                Clientes Armazenados Localmente
              </h2>
              <Link 
                to="/clients/new"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                + Novo Cliente
              </Link>
            </div>
            
            {loadingClients ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Carregando clientes...</p>
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cliente</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Não há clientes armazenados localmente.
                </p>
                <div className="mt-6">
                  <Link
                    to="/clients/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Adicionar cliente
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Nome
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Cidade
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Estado
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {clients.map(client => (
                      <tr key={client.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {client.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {client.city || "-"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {client.state || "-"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            client.synced ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {client.synced ? 'Sincronizado' : 'Pendente'}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            to={`/clients/${client.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Detalhes<span className="sr-only">, {client.name}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedTab === 'inspections' && (
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                Vistorias Armazenadas Localmente
              </h2>
              <Link 
                to="/inspections/new"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                + Nova Vistoria
              </Link>
            </div>
            
            {loadingInspections ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Carregando vistorias...</p>
              </div>
            ) : inspections.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma vistoria</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Não há vistorias armazenadas localmente.
                </p>
                <div className="mt-6">
                  <Link
                    to="/inspections/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Agendar vistoria
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Cliente
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Data
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Sincronização
                      </th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {inspections.map(inspection => (
                      <tr key={inspection.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {inspection.client_id || "-"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {inspection.inspection_date ? format(
                            new Date(inspection.inspection_date), 
                            "dd 'de' MMMM", 
                            { locale: ptBR }
                          ) : "-"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            inspection.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : inspection.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {inspection.status === 'completed' 
                              ? 'Concluída' 
                              : inspection.status === 'in_progress'
                                ? 'Em andamento'
                                : 'Agendada'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            inspection.synced ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {inspection.synced ? 'Sincronizado' : 'Pendente'}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            to={`/inspections/${inspection.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Detalhes<span className="sr-only">, {inspection.id}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmação para limpar dados */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-red-100 p-2 mr-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Confirmar exclusão
              </h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Você está prestes a limpar todos os dados armazenados localmente. 
              Se houver dados não sincronizados, eles serão perdidos permanentemente.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmClear(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleClearData}
              >
                Limpar dados
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineMode; 