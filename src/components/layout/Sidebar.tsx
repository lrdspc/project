import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Calendar, 
  Settings, 
  HelpCircle, 
  FilePlus,
  FileText,
  RefreshCw
} from 'lucide-react';

const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Nova Vistoria', icon: FilePlus, path: '/nova-vistoria' },
    { name: 'Relatórios', icon: FileText, path: '/relatorios' },
    { name: 'Clientes', icon: Users, path: '/clientes' },
    { name: 'Calendário', icon: Calendar, path: '/calendario' },
    { name: 'Sincronizar Dados', icon: RefreshCw, path: '/sincronizar' },
  ];

  const secondaryNavigation = [
    { name: 'Central de Ajuda', icon: HelpCircle, path: '/ajuda' },
    { name: 'Configurações', icon: Settings, path: '/configuracoes' },
  ];

  return (
    <div className="h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="px-4 py-5 flex items-center">
          <span className="text-xl font-bold">Sistema de Vistorias</span>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-gray-200 px-2 py-4 space-y-1">
          {secondaryNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;