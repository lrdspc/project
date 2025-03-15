import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth.context';
import PrivateRoute from './components/layout/PrivateRoute';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import MobileHeader from './components/layout/MobileHeader';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import EmailConfirmation from './pages/auth/EmailConfirmation';
import VerifyToken from './pages/auth/VerifyToken';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Calendar from './pages/Calendar';
import SupabaseTest from './pages/SupabaseTest';
import Diagnostics from './pages/Diagnostics';
import InspectionDetail from './pages/InspectionDetail';
import InstallBanner from './components/layout/InstallBanner';
import NewInspection from './pages/NewInspection';
import Reports from './pages/Reports';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/redefinir-senha" element={<ResetPassword />} />
          <Route path="/confirmar-email" element={<EmailConfirmation />} />
          <Route path="/auth/callback" element={<VerifyToken />} />
          <Route path="/supabase-test" element={<SupabaseTest />} />
          <Route path="/diagnosticos" element={<Diagnostics />} />
          <Route path="/*" element={
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
                  <div className={`lg:hidden ${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-50`}>
                    <div className="absolute inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
                    <div className="absolute inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl">
                      <Sidebar />
                    </div>
                  </div>

                  {/* Page content */}
                  <div className="flex-1 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/clientes" element={<Clients />} />
                      <Route path="/vistorias" element={<NewInspection />} />
                      <Route path="/vistorias/:id" element={<InspectionDetail />} />
                      <Route path="/relatorios" element={<Reports />} />
                      <Route path="/calendario" element={<Calendar />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </PrivateRoute>
          } />
        </Routes>
        
        {/* Banner de instalação do PWA */}
        <InstallBanner />
      </Router>
    </AuthProvider>
  );
}

export default App;