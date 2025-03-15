import React, { useState, lazy, Suspense } from 'react';
import { 
  Routes, 
  Route, 
  Navigate,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements
} from 'react-router-dom';
import { AuthProvider } from './lib/auth.context';
import PrivateRoute from './components/layout/PrivateRoute';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import MobileHeader from './components/layout/MobileHeader';

// Componente de carregamento
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Lazy loading para páginas
// Pages
const VerifyToken = lazy(() => import('./pages/auth/VerifyToken'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Clients = lazy(() => import('./pages/Clients'));
const Calendar = lazy(() => import('./pages/Calendar'));
const SupabaseTest = lazy(() => import('./pages/SupabaseTest'));
const Diagnostics = lazy(() => import('./pages/Diagnostics'));
const InspectionDetail = lazy(() => import('./pages/InspectionDetail'));
const NewInspection = lazy(() => import('./pages/NewInspection'));
const Reports = lazy(() => import('./pages/Reports'));

// Fluxo de inspeção
const ClientSelection = lazy(() => import('./pages/inspection/ClientSelection'));
const BasicInfo = lazy(() => import('./pages/inspection/BasicInfo'));
const TileSelection = lazy(() => import('./pages/inspection/TileSelection'));
const NonConformities = lazy(() => import('./pages/inspection/NonConformities'));
const PhotoCapture = lazy(() => import('./pages/inspection/PhotoCapture'));
const ReviewAndFinalize = lazy(() => import('./pages/inspection/ReviewAndFinalize'));

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Criando as rotas
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Redirecionar página de login para dashboard */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
        <Route path="/redefinir-senha" element={<Navigate to="/" replace />} />
        <Route path="/confirmar-email" element={<Navigate to="/" replace />} />
        <Route path="/auth/callback" element={
          <Suspense fallback={<LoadingFallback />}>
            <VerifyToken />
          </Suspense>
        } />
        <Route path="/supabase-test" element={
          <Suspense fallback={<LoadingFallback />}>
            <SupabaseTest />
          </Suspense>
        } />
        <Route path="/diagnosticos" element={
          <Suspense fallback={<LoadingFallback />}>
            <Diagnostics />
          </Suspense>
        } />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="flex h-screen bg-gray-50">
                {/* Sidebar for larger screens */}
                <div className="hidden lg:flex">
                  <Sidebar />
                </div>

                {/* Main content */}
                <div className="flex flex-col flex-1 overflow-x-hidden">
                  <MobileHeader toggleSidebar={toggleSidebar} />

                  {/* Mobile sidebar */}
                  <div
                    className={`lg:hidden ${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-50`}
                  >
                    <div
                      className="absolute inset-0 bg-gray-600 bg-opacity-75"
                      onClick={toggleSidebar}
                    ></div>
                    <div className="absolute inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl">
                      <Sidebar />
                    </div>
                  </div>

                  {/* Page content */}
                  <div className="flex-1 overflow-y-auto">
                    <Suspense fallback={<LoadingFallback />}>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/clientes" element={<Clients />} />
                        <Route path="/vistorias" element={<NewInspection />} />
                        <Route path="/nova-vistoria" element={<NewInspection />} />
                        <Route path="/vistorias/:id" element={<InspectionDetail />} />
                        <Route path="/relatorios" element={<Reports />} />
                        <Route path="/calendario" element={<Calendar />} />
                        <Route path="/sincronizar" element={<Diagnostics />} />
                        <Route path="/diagnosticos" element={<Diagnostics />} />
                        
                        {/* Fluxo de inspeção */}
                        <Route path="/selecao-cliente" element={<ClientSelection />} />
                        <Route path="/informacoes-basicas" element={<BasicInfo />} />
                        <Route path="/selecao-telhas" element={<TileSelection />} />
                        <Route path="/nao-conformidades" element={<NonConformities />} />
                        <Route path="/captura-fotos" element={<PhotoCapture />} />
                        <Route path="/revisao-finalizar" element={<ReviewAndFinalize />} />
                      </Routes>
                    </Suspense>
                  </div>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </>
    )
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
