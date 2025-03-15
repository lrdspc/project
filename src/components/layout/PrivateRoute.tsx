import React from 'react';
// Importações comentadas temporariamente
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../lib/auth.context';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  // Variáveis comentadas temporariamente
  // const { session, loading } = useAuth();
  // const location = useLocation();

  // Verificação temporariamente desativada - acesso direto
  return <>{children}</>;

  /* Código original comentado
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
  */
} 