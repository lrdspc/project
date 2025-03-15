/**
 * Componentes para as seções do Dashboard principal
 * Implementa as seções "Meu Dia", "Próximas Vistorias" e "Relatórios Pendentes"
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarClock, 
  ClipboardList, 
  FileText, 
  AlertTriangle,
  ArrowUpRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { format, isToday, parseISO, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useOfflineInspections } from '../../hooks/useOfflineData';

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Componente de card para o dashboard
 */
export const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  icon, 
  children, 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      <div className="flex items-center p-4 border-b border-gray-100">
        <div className="p-2 bg-blue-50 rounded-full mr-3">{icon}</div>
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

/**
 * Componente para a seção "Meu Dia"
 */
export const MyDaySection: React.FC = () => {
  const { inspections, loading } = useOfflineInspections();
  
  // Filtrar inspeções para hoje
  const todayInspections = inspections
    .filter(inspection => isToday(parseISO(inspection.inspection_date)))
    .sort((a, b) => a.inspection_date.localeCompare(b.inspection_date));
    
  if (loading) {
    return (
      <DashboardCard 
        title="Meu Dia" 
        icon={<CalendarClock className="h-5 w-5 text-blue-600" />}
      >
        <div className="flex justify-center p-8">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>
    );
  }
  
  return (
    <DashboardCard 
      title="Meu Dia" 
      icon={<CalendarClock className="h-5 w-5 text-blue-600" />}
    >
      {todayInspections.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {todayInspections.map(inspection => (
            <div key={inspection.id} className="py-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">
                    {inspection.client_id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {inspection.building_type} - {inspection.roof_area}m²
                  </p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-3.5 w-3.5 text-gray-500 mr-1" />
                    <span className="text-xs text-gray-500">
                      {format(parseISO(inspection.inspection_date), "HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/inspections/${inspection.id}`} 
                  className="p-1.5 bg-blue-50 text-blue-600 rounded-full"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <div className="p-3 bg-blue-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="h-7 w-7 text-blue-600" />
          </div>
          <p className="text-gray-600 mb-3">
            Nenhuma vistoria agendada para hoje.
          </p>
          <Link 
            to="/inspections/new"
            className="text-sm text-blue-600 font-medium"
          >
            Agendar nova vistoria
          </Link>
        </div>
      )}
    </DashboardCard>
  );
};

/**
 * Componente para a seção "Próximas Vistorias"
 */
export const UpcomingInspectionsSection: React.FC = () => {
  const { inspections, loading } = useOfflineInspections();
  
  // Filtrar inspeções dos próximos 7 dias (excluindo hoje)
  const now = new Date();
  const nextWeek = addDays(now, 7);
  
  const upcomingInspections = inspections
    .filter(inspection => {
      const inspectionDate = parseISO(inspection.inspection_date);
      return !isToday(inspectionDate) && 
             inspectionDate > now && 
             inspectionDate <= nextWeek;
    })
    .sort((a, b) => a.inspection_date.localeCompare(b.inspection_date));
    
  if (loading) {
    return (
      <DashboardCard 
        title="Próximas Vistorias" 
        icon={<ClipboardList className="h-5 w-5 text-blue-600" />}
      >
        <div className="flex justify-center p-8">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>
    );
  }
  
  return (
    <DashboardCard 
      title="Próximas Vistorias" 
      icon={<ClipboardList className="h-5 w-5 text-blue-600" />}
    >
      {upcomingInspections.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {upcomingInspections.map(inspection => (
            <div key={inspection.id} className="py-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">
                    {inspection.client_id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {inspection.building_type} - {inspection.roof_area}m²
                  </p>
                  <div className="flex items-center mt-1">
                    <CalendarClock className="h-3.5 w-3.5 text-gray-500 mr-1" />
                    <span className="text-xs text-gray-500">
                      {format(parseISO(inspection.inspection_date), "dd/MM", { locale: ptBR })} às {format(parseISO(inspection.inspection_date), "HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/inspections/${inspection.id}`} 
                  className="p-1.5 bg-blue-50 text-blue-600 rounded-full"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-600 mb-3">
            Nenhuma vistoria agendada para os próximos dias.
          </p>
          <Link 
            to="/calendar"
            className="text-sm text-blue-600 font-medium"
          >
            Ver calendário completo
          </Link>
        </div>
      )}
    </DashboardCard>
  );
};

/**
 * Componente para a seção "Relatórios Pendentes"
 */
export const PendingReportsSection: React.FC = () => {
  const { inspections, loading } = useOfflineInspections();
  
  // Filtrar inspeções com relatórios pendentes (status = 'completed' mas sem relatório)
  const pendingReports = inspections
    .filter(inspection => inspection.status === 'completed')
    .sort((a, b) => b.inspection_date.localeCompare(a.inspection_date));
    
  if (loading) {
    return (
      <DashboardCard 
        title="Relatórios Pendentes" 
        icon={<FileText className="h-5 w-5 text-blue-600" />}
      >
        <div className="flex justify-center p-8">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>
    );
  }
  
  return (
    <DashboardCard 
      title="Relatórios Pendentes" 
      icon={<FileText className="h-5 w-5 text-blue-600" />}
    >
      {pendingReports.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {pendingReports.map(inspection => (
            <div key={inspection.id} className="py-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium flex items-center">
                    {inspection.client_id}
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 ml-1.5" />
                  </h3>
                  <p className="text-sm text-gray-600">
                    {inspection.building_type} - {inspection.roof_area}m²
                  </p>
                  <div className="flex items-center mt-1">
                    <CalendarClock className="h-3.5 w-3.5 text-gray-500 mr-1" />
                    <span className="text-xs text-gray-500">
                      Inspeção em {format(parseISO(inspection.inspection_date), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/reports/new?inspection=${inspection.id}`} 
                  className="p-1.5 bg-amber-50 text-amber-600 rounded-full"
                >
                  <FileText className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <div className="p-3 bg-green-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="h-7 w-7 text-green-600" />
          </div>
          <p className="text-gray-600">
            Todos os relatórios foram gerados!
          </p>
        </div>
      )}
    </DashboardCard>
  );
}; 