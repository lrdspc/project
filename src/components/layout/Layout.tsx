/**
 * Componente de layout principal da aplicação
 * Inclui a barra lateral, cabeçalho e o conteúdo principal
 */
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout principal da aplicação
 * Contém o Sidebar e o Header, além do conteúdo principal
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Área de conteúdo principal */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 