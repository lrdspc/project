import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  FileText,
  Clock,
  MapPin,
  User,
  Building,
  ChevronLeft
} from 'lucide-react';

const NewInspection: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center mb-6">
        <Link to="/" className="text-gray-500 hover:text-gray-700 mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Vistoria</h1>
          <p className="text-gray-600">Inicie uma nova vistoria técnica</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="text-center max-w-md mx-auto">
            <div className="p-3 bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Criar Nova Vistoria</h2>
            <p className="text-gray-500 mb-6">
              Siga o passo a passo para realizar uma nova vistoria técnica, documentando informações essenciais e não conformidades encontradas.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-5 w-5 mr-3 text-gray-400" />
                <span>Tempo médio: 30-45 minutos</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                <span>Acesso mesmo sem conexão com a internet</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="h-5 w-5 mr-3 text-gray-400" />
                <span>Geração automática de relatório técnico</span>
              </div>
            </div>

            <Link
              to="/selecao-cliente"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full"
            >
              Iniciar Vistoria
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Etapas do processo de vistoria
          </h3>
          <ol className="space-y-4">
            <li className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">1</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Seleção do Cliente</p>
                <p className="text-xs text-gray-500">Selecione um cliente existente ou cadastre um novo</p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">2</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Informações Básicas</p>
                <p className="text-xs text-gray-500">Dados do empreendimento e responsáveis</p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">3</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Seleção de Telhas</p>
                <p className="text-xs text-gray-500">Identificação e quantificação dos produtos instalados</p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">4</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Não Conformidades</p>
                <p className="text-xs text-gray-500">Registro de problemas encontrados</p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">5</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Registro Fotográfico</p>
                <p className="text-xs text-gray-500">Capturas de imagens com anotações</p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">6</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Revisão e Finalização</p>
                <p className="text-xs text-gray-500">Confirmação dos dados e geração do relatório</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default NewInspection;