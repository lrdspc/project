import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  FileText, 
  Search, 
  Users, 
  RefreshCw, 
  PlusCircle,
  MapPin,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  ClipboardList,
  Camera,
  CheckCircle
} from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useInspections } from '../hooks/useInspections';
import { useProfile } from '../hooks/useProfile';
import ScheduledInspection from '../components/dashboard/ScheduledInspection';
import PendingReport from '../components/dashboard/PendingReport';

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { loading, error, getInspections } = useInspections();
  const { profile } = useProfile();
  const [inspections, setInspections] = useState([]);
  
  useEffect(() => {
    loadInspections();
  }, []);

  const isFirstTimeUser = inspections.length === 0;

  const loadInspections = async () => {
    const data = await getInspections();
    if (data) {
      setInspections(data);
    }
  };

  if (isFirstTimeUser) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Bem-vindo ao Sistema de Vistorias</h1>
          <p className="text-gray-600">Olá {profile?.full_name}, vamos começar?</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6">
            <div className="text-center max-w-2xl mx-auto">
              <div className="p-3 bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Como Funciona</h2>
              <p className="text-gray-600 mb-8">
                Este sistema foi desenvolvido para facilitar o processo de vistorias técnicas em coberturas. 
                Siga o passo a passo abaixo para realizar sua primeira vistoria.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="bg-blue-50 rounded-lg p-6 mb-4">
                  <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">1. Cadastre o Cliente</h3>
                  <p className="text-sm text-gray-600">
                    Comece cadastrando as informações do cliente e do local da vistoria.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-blue-50 rounded-lg p-6 mb-4">
                  <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">2. Realize a Vistoria</h3>
                  <p className="text-sm text-gray-600">
                    Siga o passo a passo para documentar todas as informações necessárias.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-blue-50 rounded-lg p-6 mb-4">
                  <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">3. Registre Fotos</h3>
                  <p className="text-sm text-gray-600">
                    Capture fotos para documentar as condições e não conformidades encontradas.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/nova-vistoria"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Iniciar Primeira Vistoria
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recursos Disponíveis</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium">Gestão de Clientes</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Cadastre e gerencie todos os seus clientes em um só lugar.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="bg-green-100 rounded-full p-2 mr-3">
                    <CalendarIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-medium">Agendamento</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Organize suas vistorias com um calendário integrado.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="bg-purple-100 rounded-full p-2 mr-3">
                    <Camera className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-medium">Registro Fotográfico</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Capture e organize fotos das vistorias realizadas.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="bg-orange-100 rounded-full p-2 mr-3">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="font-medium">Relatórios</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Gere relatórios profissionais automaticamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mock data for next 7 days calendar
  const generateNextDaysSchedule = () => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, index) => {
      const date = addDays(today, index);
      const count = Math.floor(Math.random() * 4); // 0-3 inspections per day
      return { date, count };
    });
  };

  const nextDaysSchedule = generateNextDaysSchedule();

  // Stats summary data
  const statsSummary = [
    {
      title: "Vistorias do Mês",
      value: "28",
      change: "12%",
      isPositive: true,
      icon: <FileText className="h-6 w-6 text-blue-500" />
    },
    {
      title: "Relatórios Pendentes",
      value: "4",
      change: "25%",
      isPositive: false,
      icon: <BarChart2 className="h-6 w-6 text-red-500" />
    },
    {
      title: "Distância Percorrida",
      value: "358 km",
      change: "8%",
      isPositive: true,
      icon: <MapPin className="h-6 w-6 text-green-500" />
    }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo(a) de volta, João! Aqui está o resumo do seu dia.</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsSummary.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className={`flex items-center ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.isPositive ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
              <span className="text-sm text-gray-500 ml-2">vs mês anterior</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scheduled Inspections for Today */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Meu Dia</h2>
              <p className="mt-1 text-sm text-gray-600">Vistorias agendadas para hoje</p>
            </div>
            <div className="px-4 py-3 sm:px-6">
              {inspections.length > 0 ? (
                <div className="space-y-3">
                  {inspections.map((inspection) => (
                    <ScheduledInspection
                      key={inspection.id}
                      id={inspection.id}
                      clientName={inspection.clientName}
                      location={inspection.location}
                      buildingType={inspection.buildingType}
                      dateTime={inspection.dateTime}
                      status={inspection.status}
                      onClick={() => console.log(`Clicked inspection ${inspection.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">Não há vistorias agendadas para hoje.</p>
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <Link 
                  to="/calendario" 
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Ver todos os agendamentos
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Link 
              to="/nova-vistoria"
              className="bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex flex-col items-center justify-center"
            >
              <PlusCircle className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">Nova Vistoria</span>
            </Link>
            <Link 
              to="/clientes"
              className="bg-white text-gray-700 text-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm flex flex-col items-center justify-center"
            >
              <Search className="h-6 w-6 mb-1 text-gray-500" />
              <span className="text-sm font-medium">Buscar Cliente</span>
            </Link>
            <Link 
              to="/relatorios"
              className="bg-white text-gray-700 text-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm flex flex-col items-center justify-center"
            >
              <FileText className="h-6 w-6 mb-1 text-gray-500" />
              <span className="text-sm font-medium">Relatórios</span>
            </Link>
            <button
              className="bg-white text-gray-700 text-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm flex flex-col items-center justify-center"
              onClick={() => console.log('Sincronizar dados')}
            >
              <RefreshCw className="h-6 w-6 mb-1 text-gray-500" />
              <span className="text-sm font-medium">Sincronizar</span>
            </button>
          </div>
        </div>

        {/* Right Column - Week Schedule & Pending Reports */}
        <div className="space-y-8">
          {/* Next 7 Days Schedule */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Próximos 7 Dias</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {nextDaysSchedule.map((day, idx) => {
                  const isToday = isSameDay(day.date, new Date());
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-center justify-between p-2 rounded-md ${
                        isToday ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isToday ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {format(day.date, 'dd')}
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${isToday ? 'text-blue-700' : 'text-gray-700'}`}>
                            {format(day.date, 'EEEE', { locale: ptBR })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(day.date, 'dd/MM/yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        day.count > 0 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {day.count} {day.count === 1 ? 'vistoria' : 'vistorias'}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-end">
                <Link 
                  to="/calendario" 
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Ver calendário completo
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Pending Reports */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Relatórios Pendentes</h2>
              <p className="mt-1 text-sm text-gray-600">Vistorias realizadas aguardando relatório</p>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Carregando relatórios...</p>
                </div>
              ) : error ? (
                <div className="text-center py-4">
                  <p className="text-red-500">Erro ao carregar relatórios</p>
                </div>
              ) : inspections.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Nenhum relatório pendente</p>
                </div>
              ) : (
                inspections
                  .filter(inspection => inspection.status === 'pending')
                  .map(report => (
                    <PendingReport
                      key={report.id}
                      id={report.id}
                      clientName={report.clients?.name || 'Cliente não encontrado'}
                      inspectionDate={format(new Date(report.inspection_date), 'dd/MM/yyyy')}
                      daysOverdue={0}
                      onClick={() => console.log(`Clicked report ${report.id}`)}
                    />
                  ))
              )}
              <div className="mt-4 flex justify-end">
                <Link 
                  to="/relatorios" 
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Ver todos os relatórios
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;