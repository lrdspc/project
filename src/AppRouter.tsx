/**
 * Componente de roteamento principal da aplicação
 * Define todas as rotas e seus respectivos componentes
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useProfile } from './hooks/useProfile';

// Páginas
import Dashboard from './pages/Dashboard';
import OfflineMode from './pages/OfflineMode';
import Login from './pages/Login';
/**
 * Componente para nova vistoria - corrige problema de importação
 * que causava erro "Failed to fetch dynamically imported module"
 */
import NewInspection from './pages/NewInspection';

// Componentes
import Layout from './components/layout/Layout';
import LoadingScreen from './components/ui/LoadingScreen';

/**
 * Componente para proteger rotas que precisam de autenticação
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { profile, loading } = useProfile();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * Componente principal de roteamento
 */
const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/offline-mode" element={
          <ProtectedRoute>
            <Layout>
              <OfflineMode />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Rotas de clientes */}
        <Route path="/clients" element={
          <ProtectedRoute>
            <Layout>
              <div>Lista de Clientes</div>
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/clients/new" element={
          <ProtectedRoute>
            <Layout>
              <div>Novo Cliente</div>
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/clients/:id" element={
          <ProtectedRoute>
            <Layout>
              <div>Detalhes do Cliente</div>
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Rotas de vistorias */}
        <Route path="/inspections" element={
          <ProtectedRoute>
            <Layout>
              <div>Lista de Vistorias</div>
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/inspections/new" element={
          <ProtectedRoute>
            <Layout>
              <NewInspection />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/inspections/:id" element={
          <ProtectedRoute>
            <Layout>
              <div>Detalhes da Vistoria</div>
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Rotas de relatórios */}
        <Route path="/reports" element={
          <ProtectedRoute>
            <Layout>
              <div>Relatórios</div>
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Outras rotas */}
        <Route path="/calendar" element={
          <ProtectedRoute>
            <Layout>
              <div>Calendário</div>
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/map" element={
          <ProtectedRoute>
            <Layout>
              <div>Mapa</div>
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/photos" element={
          <ProtectedRoute>
            <Layout>
              <div>Fotos</div>
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/statistics" element={
          <ProtectedRoute>
            <Layout>
              <div>Estatísticas</div>
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/share" element={
          <ProtectedRoute>
            <Layout>
              <div>Compartilhar</div>
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Rota padrão - redireciona para o dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter; 