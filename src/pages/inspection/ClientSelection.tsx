import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Building2, MapPin, Phone, ChevronRight, ChevronLeft } from 'lucide-react';
import ProgressBar from '../../components/ui/ProgressBar';

// Mock data for clients
const mockClients = [
  {
    id: 'CLT-001',
    name: 'Condomínio Residencial Vila Nova',
    type: 'Residencial',
    address: 'Rua das Acácias, 123 - São Paulo, SP',
    contact: '(11) 9876-5432',
    lastVisit: '10/01/2025'
  },
  {
    id: 'CLT-002',
    name: 'Escola Municipal Monteiro Lobato',
    type: 'Institucional',
    address: 'Av. Educação, 500 - São Paulo, SP',
    contact: '(11) 3456-7890',
    lastVisit: '15/02/2025'
  },
  {
    id: 'CLT-003',
    name: 'Supermercado Bom Preço',
    type: 'Comercial',
    address: 'Av. Comercial, 1500 - Guarulhos, SP',
    contact: '(11) 2345-6789',
    lastVisit: '03/03/2025'
  },
  {
    id: 'CLT-004',
    name: 'Edifício Corporativo Central Park',
    type: 'Comercial',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    contact: '(11) 5555-9999',
    lastVisit: '20/03/2025'
  },
  {
    id: 'CLT-005',
    name: 'Família Silva',
    type: 'Residencial',
    address: 'Rua dos Lírios, 45 - Campinas, SP',
    contact: '(19) 98765-4321',
    lastVisit: 'Primeira visita'
  }
];

const ClientSelection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState(mockClients);
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredClients(mockClients);
      return;
    }
    
    const filtered = mockClients.filter(client => 
      client.name.toLowerCase().includes(term.toLowerCase()) ||
      client.id.toLowerCase().includes(term.toLowerCase()) ||
      client.address.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredClients(filtered);
  };

  const handleSelectClient = (clientId: string) => {
    console.log(`Cliente selecionado: ${clientId}`);
    navigate('/informacoes-basicas');
  };

  const inspectionSteps = [
    'Cliente',
    'Informações',
    'Telhas',
    'Não Conformidades',
    'Fotos',
    'Finalização'
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center mb-6">
        <Link to="/nova-vistoria" className="text-gray-500 hover:text-gray-700 mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Seleção de Cliente</h1>
      </div>

      <ProgressBar 
        currentStep={1} 
        totalSteps={6} 
        labels={inspectionSteps}
      />

      <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
        <div className="p-6">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome, ID ou endereço..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Clientes</h2>
            <Link 
              to="/novo-cliente"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              Novo Cliente
            </Link>
          </div>

          <div className="space-y-3 mt-4">
            {filteredClients.length > 0 ? (
              filteredClients.map(client => (
                <div 
                  key={client.id}
                  className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer p-4"
                  onClick={() => handleSelectClient(client.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{client.name}</h3>
                      <p className="text-sm text-gray-500">ID: {client.id}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{client.type}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="truncate">{client.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{client.contact}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500">
                    Última visita: {client.lastVisit}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Nenhum cliente encontrado com os termos de busca.</p>
                <button 
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Novo Cliente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSelection;