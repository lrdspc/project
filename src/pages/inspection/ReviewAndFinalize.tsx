import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle, Download, Mail, Eye, FileText, User, Building2, Calendar, ClipboardList, Camera, Edit } from 'lucide-react';
import ProgressBar from '../../components/ui/ProgressBar';
import StatusBadge from '../../components/ui/StatusBadge';

const ReviewAndFinalize: React.FC = () => {
  const navigate = useNavigate();
  const [finalComments, setFinalComments] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  
  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false);
      setReportGenerated(true);
    }, 2000);
  };
  
  const handleEmailReport = () => {
    alert('Relatório enviado por e-mail com sucesso!');
  };
  
  const handleDownloadReport = () => {
    alert('Iniciando download do relatório...');
  };

  const inspectionSteps = [
    'Cliente',
    'Informações',
    'Telhas',
    'Não Conformidades',
    'Fotos',
    'Finalização'
  ];
  
  // Mock data for review
  const inspectionData = {
    client: 'Condomínio Residencial Vila Nova',
    address: 'Rua das Acácias, 123 - São Paulo, SP',
    contactPerson: 'Carlos Silva',
    inspectionDate: '21/05/2025',
    buildingType: 'Residencial Multifamiliar',
    roofArea: '450m²',
    constructionYear: '2010',
    tilesSelected: [
      { line: 'Ondulada', thickness: '6mm', dimensions: '2.44m x 1.10m', quantity: 120, area: 321.1 },
      { line: 'TopComfort', thickness: '8mm', dimensions: '2.20m x 0.95m', quantity: 15, area: 31.4 }
    ],
    nonConformities: [
      'Fixação Irregular das Telhas',
      'Corte de Canto Incorreto ou Ausente',
      'Recobrimento Incorreto'
    ],
    photoCount: 8
  };
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center mb-6">
        <Link to="/registro-fotografico" className="text-gray-500 hover:text-gray-700 mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Revisão e Finalização</h1>
      </div>
      
      <ProgressBar 
        currentStep={6} 
        totalSteps={6} 
        labels={inspectionSteps}
      />
      
      <div className="mt-6">
        {reportGenerated ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 text-center">
              <div className="rounded-full bg-green-100 p-3 inline-flex mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">Relatório Gerado com Sucesso!</h2>
              <p className="text-gray-600 mb-6">
                O relatório de vistoria para {inspectionData.client} foi gerado e está pronto para ser compartilhado.
              </p>
              
              <StatusBadge status="completed" text="Vistoria Concluída" />
              
              <div className="flex justify-center space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => {}}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Visualizar
                </button>
                <button
                  type="button"
                  onClick={handleDownloadReport}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Baixar DOCX
                </button>
                <button
                  type="button"
                  onClick={handleEmailReport}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Enviar por Email
                </button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Voltar ao Dashboard
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Resumo da Vistoria</h2>
                
                <div className="space-y-6">
                  {/* Client Information */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      Informações do Cliente
                    </h3>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Cliente:</p>
                        <p className="font-medium">{inspectionData.client}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Endereço:</p>
                        <p className="font-medium">{inspectionData.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Responsável:</p>
                        <p className="font-medium">{inspectionData.contactPerson}</p>
                      </div>
                    </div>
                    <div className="mt-1 text-right">
                      <Link to="/informacoes-basicas" className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-end">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Link>
                    </div>
                  </div>
                  
                  {/* Inspection Details */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Detalhes da Vistoria
                    </h3>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Data:</p>
                        <p className="font-medium">{inspectionData.inspectionDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tipo de Construção:</p>
                        <p className="font-medium">{inspectionData.buildingType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ano de Construção:</p>
                        <p className="font-medium">{inspectionData.constructionYear}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Área do Telhado:</p>
                        <p className="font-medium">{inspectionData.roofArea}</p>
                      </div>
                    </div>
                    <div className="mt-1 text-right">
                      <Link to="/informacoes-basicas" className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-end">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Link>
                    </div>
                  </div>
                  
                  {/* Tiles Information */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      Telhas Identificadas
                    </h3>
                    <div className="mt-2 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Linha
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Espessura
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Dimensões
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Qtde
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Área (m²)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {inspectionData.tilesSelected.map((tile, index) => (
                            <tr key={index}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{tile.line}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{tile.thickness}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{tile.dimensions}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{tile.quantity}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{tile.area}</td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50">
                            <td colSpan={4} className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              Área Total:
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {inspectionData.tilesSelected.reduce((sum, tile) => sum + tile.area, 0).toFixed(1)} m²
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-1 text-right">
                      <Link to="/selecao-telhas" className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-end">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Link>
                    </div>
                  </div>
                  
                  {/* Non-conformities */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center">
                      <ClipboardList className="h-4 w-4 mr-1" />
                      Não Conformidades Identificadas
                    </h3>
                    <div className="mt-2">
                      <ul className="space-y-1">
                        {inspectionData.nonConformities.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-2 text-right">
                      <Link to="/nao-conformidades" className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-end">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Link>
                    </div>
                  </div>
                  
                  {/* Photos */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center">
                      <Camera className="h-4 w-4 mr-1" />
                      Registro Fotográfico
                    </h3>
                    <div className="mt-2">
                      <p>{inspectionData.photoCount} fotos adicionadas ao relatório</p>
                    </div>
                    <div className="mt-1 text-right">
                      <Link to="/registro-fotografico" className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-end">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Final Comments Section */}
              <div className="p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Observações Finais e Recomendações Técnicas</h3>
                <textarea
                  rows={4}
                  value={finalComments}
                  onChange={(e) => setFinalComments(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Adicione observações finais ou recomendações técnicas para o cliente..."
                />
              </div>
              
              {/* Signatures */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Assinaturas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <User className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Assinatura do Técnico</p>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Assinar Digitalmente
                    </button>
                  </div>
                  
                  <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <User className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Assinatura do Cliente</p>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Solicitar Assinatura
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-between">
              <Link
                to="/registro-fotografico"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Voltar
              </Link>
              <button
                type="button"
                onClick={handleGenerateReport}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gerando Relatório...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    Gerar Relatório Final
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewAndFinalize;