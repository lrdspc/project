/**
 * Componente de cabeçalho da aplicação
 * Exibe informações do usuário e controles de navegação
 */
import React from 'react';
import { Bell, Menu, X } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { useConnectionStatus } from '../../hooks/useOfflineData';

interface HeaderProps {
  toggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

/**
 * Cabeçalho da aplicação com informações do usuário e notificações
 */
const Header: React.FC<HeaderProps> = ({ 
  toggleSidebar, 
  isSidebarOpen = true 
}) => {
  const { profile } = useProfile();
  const { isOnline } = useConnectionStatus();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Botão de menu para mobile */}
        <button
          type="button"
          className="md:hidden text-gray-500 hover:text-gray-600"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </button>

        {/* Título da página - visível apenas em desktop */}
        <div className="hidden md:block">
          <h1 className="text-lg font-medium text-gray-900">Sistema de Vistorias</h1>
        </div>

        {/* Área direita - notificações e perfil */}
        <div className="flex items-center space-x-4">
          {/* Indicador de status online/offline */}
          <div className="hidden sm:flex items-center">
            <div 
              className={`h-2 w-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
            ></div>
            <span className="text-sm text-gray-600">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Notificações */}
          <button
            type="button"
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="sr-only">Ver notificações</span>
            <Bell className="h-6 w-6" />
          </button>

          {/* Perfil do usuário */}
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
              {profile?.full_name?.split(' ')[0] || 'Usuário'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 