import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  MessageSquare, 
  Calendar, 
  FileText 
} from 'lucide-react';

const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, current: true },
    { name: 'Team', icon: Users, current: false },
    { name: 'Projects', icon: FileText, current: false },
    { name: 'Calendar', icon: Calendar, current: false },
    { name: 'Messages', icon: MessageSquare, current: false },
    { name: 'Analytics', icon: BarChart3, current: false },
  ];

  const secondaryNavigation = [
    { name: 'Help Center', icon: HelpCircle },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href="#"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                item.current
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${
                  item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {item.name}
            </a>
          ))}
        </nav>
        <div className="border-t border-gray-200 px-2 py-4 space-y-1">
          {secondaryNavigation.map((item) => (
            <a
              key={item.name}
              href="#"
              className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;