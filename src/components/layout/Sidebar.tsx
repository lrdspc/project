/**
 * Componente de barra lateral da aplicação
 * Exibe links de navegação para as principais seções
 */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  FileText,
  Calendar,
  Map,
  BarChart2,
  Camera,
  Settings,
  LogOut,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useConnectionStatus } from '../../hooks/useOfflineData';

/**
 * Item da barra lateral
 */
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
}

/**
 * Componente para cada item da barra lateral
 */
const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  to, 
  isActive 
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md mb-1 ${
        isActive
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <div className="mr-3">{icon}</div>
      <span>{label}</span>
    </Link>
  );
};

/**
 * Barra lateral principal da aplicação
 */
const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isOnline } = useConnectionStatus();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Verifica se o caminho atual corresponde ao item
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Lista de itens da navegação
  const navItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Users size={20} />, label: 'Clientes', path: '/clients' },
    { icon: <FileText size={20} />, label: 'Vistorias', path: '/inspections' },
    { icon: <Calendar size={20} />, label: 'Agenda', path: '/calendar' },
    { icon: <Map size={20} />, label: 'Mapa', path: '/map' },
    { icon: <Camera size={20} />, label: 'Fotos', path: '/photos' },
    { icon: <BarChart2 size={20} />, label: 'Estatísticas', path: '/statistics' },
    { 
      icon: isOnline ? <Wifi size={20} /> : <WifiOff size={20} />, 
      label: 'Modo Offline', 
      path: '/offline-mode' 
    },
  ];

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    } transition-all duration-300 ease-in-out`}>
      {/* Logo */}
      <div className="px-4 py-5 flex items-center justify-between">
        {!isCollapsed && (
          <div className="text-xl font-bold text-blue-600">Bolt SB1</div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        {navItems.map((item, index) => (
          <React.Fragment key={index}>
            {isCollapsed ? (
              <Link
                to={item.path}
                className={`flex justify-center p-3 rounded-md mb-1 ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={item.label}
              >
                {item.icon}
              </Link>
            ) : (
              <SidebarItem
                icon={item.icon}
                label={item.label}
                to={item.path}
                isActive={isActive(item.path)}
              />
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Rodapé */}
      <div className="p-4 border-t border-gray-200">
        {isCollapsed ? (
          <div className="flex flex-col items-center space-y-4">
            <Link
              to="/settings"
              className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
              title="Configurações"
            >
              <Settings size={20} />
            </Link>
            <button
              className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <Settings size={20} className="mr-3" />
              <span>Configurações</span>
            </Link>
            <button
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut size={20} className="mr-3" />
              <span>Sair</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
