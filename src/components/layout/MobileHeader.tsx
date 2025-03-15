import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MobileHeaderProps {
  toggleSidebar: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      >
        <span className="sr-only">Abrir menu</span>
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold">
            Brasi<span className="text-blue-600">lit</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default MobileHeader;
