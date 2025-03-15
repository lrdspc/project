/**
 * Componente de tela de carregamento
 * Exibe um indicador de carregamento para operações assíncronas
 */
import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

/**
 * Tela de carregamento para quando a aplicação está carregando dados iniciais
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Carregando...' 
}) => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-700 text-lg">{message}</p>
    </div>
  );
};

export default LoadingScreen; 