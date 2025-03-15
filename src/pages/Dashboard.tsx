/**
 * Página principal do dashboard
 * Mostra uma visão geral das atividades do usuário e acesso rápido às funcionalidades
 */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  FileText,
  Users,
  CalendarCheck,
  Clock,
  BarChart2,
  Map,
  Camera,
  Share
} from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useConnectionStatus } from '../hooks/useOfflineData';
import ConnectionStatus from '../components/ui/ConnectionStatus';
import { 
  MyDaySection, 
  UpcomingInspectionsSection, 
  PendingReportsSection 
} from '../components/dashboard/DashboardSections';

/**
 * Botão de ação rápida para o dashboard
 */
interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  color: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ 
  icon, 
  label, 
  to, 
  color 
}) => {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center p-3 rounded-lg ${color} transition-transform hover:scale-105`}
    >
      <div className="p-3 bg-white rounded-full shadow-sm mb-2">
        {icon}
      </div>
      <span className="text-xs font-medium text-white text-center">
        {label}
      </span>
    </Link>
  );
};

/**
 * Página principal do dashboard
 */
const Dashboard: React.FC = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { isOnline } = useConnectionStatus();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {profileLoading ? (
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            ) : (
              <>Olá, {profile?.full_name?.split(' ')[0] || 'Técnico'}</>
            )}
          </h1>
          <p className="text-gray-600">
            Bem-vindo ao sistema de vistorias
          </p>
        </div>
        
        {/* Status de conexão */}
        <div className="mt-4 sm:mt-0">
          <ConnectionStatus />
        </div>
      </div>
      
      {/* Botões de ação rápida */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-4 mb-6">
        <QuickActionButton
          icon={<PlusCircle className="h-6 w-6 text-blue-600" />}
          label="Nova Vistoria"
          to="/inspections/new"
          color="bg-blue-600"
        />
        <QuickActionButton
          icon={<Users className="h-6 w-6 text-emerald-600" />}
          label="Clientes"
          to="/clients"
          color="bg-emerald-600"
        />
        <QuickActionButton
          icon={<FileText className="h-6 w-6 text-amber-600" />}
          label="Relatórios"
          to="/reports"
          color="bg-amber-600"
        />
        <QuickActionButton
          icon={<CalendarCheck className="h-6 w-6 text-indigo-600" />}
          label="Agenda"
          to="/calendar"
          color="bg-indigo-600"
        />
        <QuickActionButton
          icon={<BarChart2 className="h-6 w-6 text-purple-600" />}
          label="Estatísticas"
          to="/statistics"
          color="bg-purple-600"
        />
        <QuickActionButton
          icon={<Map className="h-6 w-6 text-green-600" />}
          label="Mapa"
          to="/map"
          color="bg-green-600"
        />
        <QuickActionButton
          icon={<Camera className="h-6 w-6 text-rose-600" />}
          label="Fotos"
          to="/photos"
          color="bg-rose-600"
        />
        <QuickActionButton
          icon={<Share className="h-6 w-6 text-sky-600" />}
          label={isOnline ? "Compartilhar" : "Offline"}
          to={isOnline ? "/share" : "/offline-mode"}
          color={isOnline ? "bg-sky-600" : "bg-gray-600"}
        />
      </div>
      
      {/* Seções principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MyDaySection />
        <UpcomingInspectionsSection />
        <PendingReportsSection />
      </div>
      
      {/* Aviso de modo offline */}
      {!isOnline && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                Modo Offline Ativo
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  Você está trabalhando em modo offline. Suas alterações serão sincronizadas
                  automaticamente quando a conexão for restabelecida.
                </p>
              </div>
              <div className="mt-3">
                <Link
                  to="/offline-mode"
                  className="text-sm font-medium text-amber-800 hover:text-amber-600"
                >
                  Gerenciar dados offline →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
