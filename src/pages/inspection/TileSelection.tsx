import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2 } from 'lucide-react';
import ProgressBar from '../../components/ui/ProgressBar';
import TileSelector, { TileSelection } from '../../components/tiles/TileSelector';

const TileSelectionPage: React.FC = () => {
  const [selectedTiles, setSelectedTiles] = useState<TileSelection[]>([]);
  const navigate = useNavigate();

  const handleAddTile = (tile: TileSelection) => {
    setSelectedTiles([...selectedTiles, tile]);
  };

  const handleRemoveTile = (id: string) => {
    setSelectedTiles(selectedTiles.filter(tile => tile.id !== id));
  };

  const calculateTotalArea = (): number => {
    return selectedTiles.reduce((total, tile) => total + tile.area, 0);
  };

  const handleNext = () => {
    if (selectedTiles.length > 0) {
      navigate('/nao-conformidades');
    }
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
        <Link to="/informacoes-basicas" className="text-gray-500 hover:text-gray-700 mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Seleção de Telhas</h1>
      </div>

      <ProgressBar 
        currentStep={3} 
        totalSteps={6} 
        labels={inspectionSteps}
      />

      <div className="mt-6 space-y-6">
        {/* Tile Selection Form */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Adicionar Tipos de Telhas</h2>
            <TileSelector onAdd={handleAddTile} />
          </div>
        </div>

        {/* Selected Tiles Summary */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Telhas Selecionadas</h2>
            
            {selectedTiles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Linha
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Espessura
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dimensões
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantidade
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Área (m²)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedTiles.map((tile) => (
                      <tr key={tile.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tile.line}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tile.thickness}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tile.dimensions}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tile.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tile.area} m²</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => console.log(`Edit tile ${tile.id}`)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleRemoveTile(tile.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Total row */}
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        Área Total:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {calculateTotalArea()} m²
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Nenhuma telha adicionada. Use o formulário acima para adicionar telhas ao relatório.</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Link
            to="/informacoes-basicas"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Voltar
          </Link>
          <button
            type="button"
            onClick={handleNext}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              selectedTiles.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            disabled={selectedTiles.length === 0}
          >
            Próximo
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TileSelectionPage;