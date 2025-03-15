import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth.context';
import PrivateRoute from './components/layout/PrivateRoute';
import UserMenu from './components/layout/UserMenu';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { 
  Bell, 
  Search, 
  Menu,
  X,
  Zap
} from 'lucide-react';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import MobileMenu from './components/layout/MobileMenu';

// Pages
import Dashboard from './pages/Dashboard';
import NewInspection from './pages/NewInspection';
import ClientSelection from './pages/inspection/ClientSelection';
import BasicInfo from './pages/inspection/BasicInfo';
import TileSelection from './pages/inspection/TileSelection';
import NonConformities from './pages/inspection/NonConformities';
import PhotoCapture from './pages/inspection/PhotoCapture';
import ReviewAndFinalize from './pages/inspection/ReviewAndFinalize';
import Reports from './pages/Reports';
import Clients from './pages/Clients';
import Calendar from './pages/Calendar';

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={
            <PrivateRoute>
              <div className="flex h-screen bg-gray-50">
                {/* Sidebar for larger screens */}
                <div className="hidden lg:flex">
                  <Sidebar />
                </div>

                {/* Mobile sidebar overlay */}
                <div 
                  className={`fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75 transition-opacity duration-300 ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  onClick={toggleSidebar}
                />

                {/* Mobile sidebar drawer */}
                <div 
                  className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:hidden ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                  }`}
                >
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-6 w-6 text-blue-600" />
                      <span className="text-xl font-bold">Brasi<span className="text-blue-600">lit</span></span>
                    </div>
                    <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100">
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="py-4">
                    <Sidebar />
                  </div>
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Top navigation */}
                  <header className="bg-white shadow-sm z-10">
                    <div className="px-4 sm:px-6 lg:px-8 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <button 
                            onClick={toggleSidebar} 
                            className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
                          >
                            <Menu className="h-6 w-6" />
                          </button>
                          <div className="ml-2 lg:ml-0 flex items-center space-x-2">
                            <Zap className="h-6 w-6 text-blue-600 hidden lg:block" />
                            <span className="text-xl font-bold hidden lg:block">Brasi<span className="text-blue-600">lit</span></span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="relative hidden md:block">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              placeholder="Buscar..."
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <button className="p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 relative">
                            <Bell className="h-6 w-6" />
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                          </button>
                          <div className="flex items-center">
                            <UserMenu />
                          </div>
                        </div>
                      </div>
                    </div>
                  </header>

                  {/* Main content area */}
                  <main className="flex-1 overflow-y-auto bg-gray-50">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/nova-vistoria" element={<NewInspection />} />
                      <Route path="/selecao-cliente" element={<ClientSelection />} />
                      <Route path="/informacoes-basicas" element={<BasicInfo />} />
                      <Route path="/selecao-telhas" element={<TileSelection />} />
                      <Route path="/nao-conformidades" element={<NonConformities />} />
                      <Route path="/registro-fotografico" element={<PhotoCapture />} />
                      <Route path="/revisao-finalizacao" element={<ReviewAndFinalize />} />
                      <Route path="/relatorios" element={<Reports />} />
                      <Route path="/clientes" element={<Clients />} />
                      <Route path="/calendario" element={<Calendar />} />
                    </Routes>
                  </main>

                  {/* Mobile menu (visible on small screens) */}
                  <div className="lg:hidden">
                    <MobileMenu />
                  </div>
                </div>
              </div>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;