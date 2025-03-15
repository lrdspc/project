import React, { useState } from 'react';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addMonths, subMonths, getDay, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, User, Calendar as CalendarIcon } from 'lucide-react';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Mock data for inspections
  const events = [
    {
      id: '1',
      title: 'Condomínio Residencial Vila Nova',
      date: '2025-05-21',
      time: '09:00 - 10:30',
      address: 'Rua das Acácias, 123 - São Paulo, SP',
      contact: 'Carlos Silva',
      status: 'confirmed'
    },
    {
      id: '2',
      title: 'Escola Municipal Monteiro Lobato',
      date: '2025-05-22',
      time: '13:00 - 15:00',
      address: 'Av. Educação, 500 - São Paulo, SP',
      contact: 'Maria Oliveira',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Supermercado Bom Preço',
      date: '2025-05-23',
      time: '16:30 - 18:00',
      address: 'Av. Comercial, 1500 - Guarulhos, SP',
      contact: 'Roberto Santos',
      status: 'confirmed'
    },
    {
      id: '4',
      title: 'Edifício Corporativo Central Park',
      date: '2025-05-25',
      time: '10:00 - 12:00',
      address: 'Av. Paulista, 1000 - São Paulo, SP',
      contact: 'Carla Mendes',
      status: 'pending'
    },
    {
      id: '5',
      title: 'Família Silva',
      date: '2025-05-27',
      time: '15:00 - 16:00',
      address: 'Rua dos Lírios, 45 - Campinas, SP',
      contact: 'José Silva',
      status: 'confirmed'
    }
  ];
  
  const header = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="flex items-center justify-between px-4 py-2">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <span className="text-lg font-semibold text-gray-900 uppercase">
          {format(currentDate, dateFormat, { locale: ptBR })}
        </span>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    );
  };
  
  const daysOfWeek = () => {
    const dateFormat = "EEEEE";
    const days = [];
    const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
    
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-sm font-medium text-gray-500 py-2">
          {format(addDays(startDate, i), dateFormat, { locale: ptBR }).toUpperCase()}
        </div>
      );
    }
    
    return <div className="grid grid-cols-7">{days}</div>;
  };
  
  const cells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'yyyy-MM-dd');
        const cloneDay = day;
        const dayEvents = events.filter(event => event.date === formattedDate);
        
        days.push(
          <div
            key={day.toString()}
            className={`min-h-[100px] p-1 border border-gray-200 ${
              !isSameMonth(day, monthStart)
                ? 'bg-gray-50 text-gray-400'
                : isSameDay(day, selectedDate)
                ? 'bg-blue-50 text-blue-900'
                : 'bg-white text-gray-900'
            }`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <div className="flex justify-between">
              <span className={`text-sm font-medium p-1 w-7 h-7 flex items-center justify-center rounded-full ${
                isSameDay(day, new Date()) ? 'bg-blue-600 text-white' : ''
              }`}>
                {format(day, 'd')}
              </span>
              {dayEvents.length > 0 && (
                <div className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 flex items-center">
                  {dayEvents.length}
                </div>
              )}
            </div>
            
            <div className="mt-1 space-y-1">
              {dayEvents.map((event, idx) => (
                <div 
                  key={idx}
                  className={`text-xs p-1 rounded truncate ${
                    event.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {event.time} - {event.title.length > 15 ? `${event.title.substring(0, 15)}...` : event.title}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="bg-white border border-gray-200 rounded-lg">{rows}</div>;
  };
  
  const selectedDateEvents = events.filter(
    event => event.date === format(selectedDate, 'yyyy-MM-dd')
  );
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendário de Vistorias</h1>
          <p className="text-gray-600">Visualize e gerencie seus agendamentos.</p>
        </div>
        <button 
          type="button"
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Vistoria
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {header()}
            {daysOfWeek()}
            {cells()}
          </div>
        </div>
        
        {/* Selected Day Events */}
        <div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">
                  {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </h2>
              </div>
            </div>
            
            <div className="p-4">
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg overflow-hidden">
                      <div className={`px-4 py-2 ${
                        event.status === 'confirmed' ? 'bg-green-50' : 'bg-yellow-50'
                      }`}>
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-gray-900">{event.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            event.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {event.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 space-y-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{event.address}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{event.contact}</span>
                        </div>
                        
                        <div className="pt-3 flex space-x-2">
                          <button className="flex-1 inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Detalhes
                          </button>
                          <button className="flex-1 inline-flex justify-center items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Iniciar Vistoria
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">
                    Não há vistorias agendadas para este dia.
                  </p>
                  <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Plus className="h-5 w-5 mr-2" />
                    Agendar Vistoria
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;