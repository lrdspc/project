import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Calendar, 
  FilePlus
} from 'lucide-react';

const MobileMenu = () => {
  const mobileNavigation = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Nova Vistoria', icon: FilePlus, path: '/nova-vistoria' },
    { name: 'Relatórios', icon: FileText, path: '/relatorios' },
    { name: 'Clientes', icon: Users, path: '/clientes' },
    { name: 'Calendário', icon: Calendar, path: '/calendario' },
  ];

  return (
    <div className="fixed bottom-0 w-full border-t border-gray-200 bg-white">
      <div className="grid grid-cols-5">
        {mobileNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center py-3 ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`h-6 w-6 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                />
                <span className="text-xs mt-1">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;