/**
 * Componente principal da aplicação
 * Inicializa o roteamento e os provedores de contexto
 */
import React from 'react';
import AppRouter from './AppRouter';
import { AuthProvider } from './lib/auth.context';

/**
 * Componente raiz da aplicação
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
