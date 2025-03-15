/**
 * Componente principal da aplicação
 * Inicializa o roteamento e os provedores de contexto
 */
import React from 'react';
import AppRouter from './AppRouter';

/**
 * Componente raiz da aplicação
 */
const App: React.FC = () => {
  return <AppRouter />;
};

export default App;
