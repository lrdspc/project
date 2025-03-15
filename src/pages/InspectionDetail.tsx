import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  Calendar,
  FileText,
  Edit2,
  Camera,
  Map,
  User,
  Phone,
  Mail,
  AlertTriangle,
  Layers,
  Download,
  Printer,
} from 'lucide-react';
import { useInspections } from '../hooks/useInspections';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Definição de interfaces para melhorar a tipagem
interface Photo {
  id: string;
  category: string;
  caption: string;
  photo_url: string;
  created_at: string;
  nonconformity_id?: string | null;
}

interface Nonconformity {
  id: string;
  title: string;
  description: string;
  notes?: string | null;
  created_at: string;
  inspection_photos?: Photo[];
}

interface Tile {
  id: string;
  line: string;
  thickness: string;
  dimensions: string;
  quantity: number;
  area: number;
}

interface Client {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  contact_name?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  type: string;
}

interface Inspection {
  id: string;
  client_id: string;
  status: string;
  inspection_date: string;
  building_type: string;
  construction_year?: number | null;
  roof_area: number;
  last_maintenance?: string | null;
  main_issue?: string | null;
  created_at: string;
  updated_at: string;
  clients?: Client;
  inspection_tiles?: Tile[];
  nonconformities?: Nonconformity[];
  inspection_photos?: Photo[];
}

const InspectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInspectionById, loading, error } = useInspections();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [activeTab, setActiveTab] = useState<
    'info' | 'tiles' | 'nonconformities' | 'photos'
  >('info');

  useEffect(() => {
    if (id) {
      loadInspection(id);
    }
  }, [id]);

  const loadInspection = async (inspectionId: string) => {
    const data = await getInspectionById(inspectionId);
    if (data) {
      setInspection(data);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <div className="flex">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-1 h-5 w-5" />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">Vistoria não encontrada</p>
            </div>
          </div>
        </div>
        <div className="flex">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-1 h-5 w-5" />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Detalhes da Vistoria
            </h1>
          </div>
          <div className="flex space-x-3">
            <button
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </button>
            <Link
              to={`/editar-vistoria/${id}`}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </div>
        </div>
        <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <Building className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
            Cliente: {inspection.clients?.name || 'N/A'}
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
            Data: {formatDate(inspection.inspection_date)}
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <Map className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
            Área: {inspection.roof_area} m²
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <FileText className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
            Status:
            <span
              className={`ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                inspection.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : inspection.status === 'in_progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {inspection.status === 'completed'
                ? 'Concluída'
                : inspection.status === 'in_progress'
                  ? 'Em Andamento'
                  : inspection.status === 'pending'
                    ? 'Pendente'
                    : inspection.status}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('info')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Informações Básicas
          </button>
          <button
            onClick={() => setActiveTab('tiles')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tiles'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Telhas
          </button>
          <button
            onClick={() => setActiveTab('nonconformities')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'nonconformities'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Não Conformidades
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'photos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Fotos
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {activeTab === 'info' && (
          <>
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Informações da Vistoria
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Detalhes básicos e informações do cliente.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {inspection.clients?.name || 'N/A'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Endereço
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {inspection.clients?.address || 'N/A'},{' '}
                    {inspection.clients?.city || 'N/A'} -{' '}
                    {inspection.clients?.state || 'N/A'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Contato</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-gray-400" />
                      {inspection.clients?.contact_name || 'N/A'}
                    </div>
                    <div className="flex items-center mt-1">
                      <Phone className="mr-2 h-4 w-4 text-gray-400" />
                      {inspection.clients?.contact_phone || 'N/A'}
                    </div>
                    <div className="flex items-center mt-1">
                      <Mail className="mr-2 h-4 w-4 text-gray-400" />
                      {inspection.clients?.contact_email || 'N/A'}
                    </div>
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Data da Vistoria
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDate(inspection.inspection_date)}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Tipo de Edificação
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {inspection.building_type || 'N/A'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Ano de Construção
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {inspection.construction_year || 'N/A'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Área do Telhado
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {inspection.roof_area} m²
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Última Manutenção
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {inspection.last_maintenance
                      ? formatDate(inspection.last_maintenance)
                      : 'Não informado'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Principal Problema
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {inspection.main_issue || 'Não informado'}
                  </dd>
                </div>
              </dl>
            </div>
          </>
        )}

        {activeTab === 'tiles' && (
          <>
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Telhas Inspecionadas
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Relação das telhas identificadas na vistoria.
              </p>
            </div>
            <div className="border-t border-gray-200">
              {inspection.inspection_tiles &&
              inspection.inspection_tiles.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Linha
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Espessura
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Dimensões
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Quantidade
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Área (m²)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inspection.inspection_tiles.map((tile: Tile) => (
                        <tr key={tile.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {tile.line}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {tile.thickness}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {tile.dimensions}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {tile.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {tile.area}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-4 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center py-6">
                    <Layers className="h-12 w-12 text-gray-300 mb-3" />
                    <p>Nenhuma telha cadastrada para esta vistoria.</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'nonconformities' && (
          <>
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Não Conformidades
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Problemas identificados durante a vistoria.
              </p>
            </div>
            <div className="border-t border-gray-200">
              {inspection.nonconformities &&
              inspection.nonconformities.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {inspection.nonconformities.map((item: Nonconformity) => (
                    <div key={item.id} className="px-4 py-5 sm:px-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="text-lg font-medium text-gray-900">
                            {item.title}
                          </h4>
                          <p className="mt-1 text-sm text-gray-600">
                            {item.description}
                          </p>
                          {item.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-md">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">
                                  Observações:
                                </span>{' '}
                                {item.notes}
                              </p>
                            </div>
                          )}

                          {/* Fotos relacionadas à não conformidade */}
                          {item.inspection_photos &&
                            item.inspection_photos.length > 0 && (
                              <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                  Evidências fotográficas:
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                  {item.inspection_photos.map(
                                    (photo: Photo) => (
                                      <div
                                        key={photo.id}
                                        className="relative group"
                                      >
                                        <img
                                          src={photo.photo_url}
                                          alt={photo.caption}
                                          className="h-24 w-full object-cover rounded-md"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 rounded-md flex items-center justify-center">
                                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button className="bg-white p-1.5 rounded-full shadow">
                                              <Camera className="h-4 w-4 text-gray-700" />
                                            </button>
                                          </div>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500 truncate">
                                          {photo.caption}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-4 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center py-6">
                    <AlertTriangle className="h-12 w-12 text-gray-300 mb-3" />
                    <p>
                      Nenhuma não conformidade registrada para esta vistoria.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'photos' && (
          <>
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Registro Fotográfico
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Fotos capturadas durante a vistoria.
              </p>
            </div>
            <div className="border-t border-gray-200">
              {inspection.inspection_photos &&
              inspection.inspection_photos.length > 0 ? (
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {inspection.inspection_photos.map((photo: Photo) => (
                      <div key={photo.id} className="group">
                        <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 relative">
                          <img
                            src={photo.photo_url}
                            alt={photo.caption}
                            className="object-cover h-full w-full group-hover:opacity-90 transition-opacity duration-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <div className="flex space-x-2">
                              <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
                                <Camera className="h-5 w-5 text-gray-700" />
                              </button>
                              <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
                                <Download className="h-5 w-5 text-gray-700" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-900">
                            {photo.category}
                          </p>
                          <p className="text-sm text-gray-500">
                            {photo.caption}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="px-6 py-4 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center py-6">
                    <Camera className="h-12 w-12 text-gray-300 mb-3" />
                    <p>Nenhuma foto registrada para esta vistoria.</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InspectionDetail;
