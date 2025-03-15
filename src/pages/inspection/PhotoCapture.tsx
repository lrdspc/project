import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Camera, Upload, Trash2, Tag, Image, Plus } from 'lucide-react';
import ProgressBar from '../../components/ui/ProgressBar';

interface Photo {
  id: string;
  src: string;
  caption: string;
  category: string;
}

const PhotoCapture: React.FC = () => {
  const navigate = useNavigate();
  
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: '1',
      src: 'https://images.unsplash.com/photo-1598252976330-36b92fcbfe41?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9vZiUyMHRpbGVzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      caption: 'Vista geral do telhado',
      category: 'geral'
    },
    {
      id: '2',
      src: 'https://images.unsplash.com/photo-1632759147091-755708e5f1e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cm9vZiUyMHRpbGVzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      caption: 'Detalhe da cumeeira',
      category: 'detalhe'
    },
    {
      id: '3',
      src: 'https://images.unsplash.com/photo-1616237579207-c09f41f87387?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJvb2YlMjBkaXNyZXBhaXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      caption: 'Infiltração na área de junção com a parede',
      category: 'nao_conformidade'
    }
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('geral');
  const [caption, setCaption] = useState<string>('');
  
  const categories = [
    { id: 'geral', name: 'Vista Geral' },
    { id: 'detalhe', name: 'Detalhes Construtivos' },
    { id: 'nao_conformidade', name: 'Não Conformidades' },
    { id: 'equipe', name: 'Equipe e Visita' }
  ];
  
  const handleAddPhoto = () => {
    // In a real app, this would open the camera or file picker
    // For this mock, we'll add a placeholder image
    const mockPhoto = {
      id: Date.now().toString(),
      src: 'https://images.unsplash.com/photo-1605870445919-838d190e8e1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fHJvb2Z8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      caption: caption || `Foto ${photos.length + 1}`,
      category: selectedCategory
    };
    
    setPhotos([...photos, mockPhoto]);
    setCaption('');
  };
  
  const handleRemovePhoto = (id: string) => {
    setPhotos(photos.filter(photo => photo.id !== id));
  };
  
  const handleNext = () => {
    if (photos.length > 0) {
      navigate('/revisao-finalizacao');
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
        <Link to="/nao-conformidades" className="text-gray-500 hover:text-gray-700 mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Registro Fotográfico</h1>
      </div>
      
      <ProgressBar 
        currentStep={5} 
        totalSteps={6} 
        labels={inspectionSteps}
      />
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photo Capture Controls */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Adicionar Fotos</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Legenda
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Descreva o que está sendo mostrado"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Capturar Foto
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Carregar
                  </button>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Contagem de Fotos</h3>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Fotos adicionadas:</span>
                    <span className="text-sm font-medium text-blue-700">{photos.length} / 15</span>
                  </div>
                  
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${(photos.length / 15) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 mt-6 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Categorias</h3>
                <div className="space-y-2">
                  {categories.map(category => {
                    const count = photos.filter(p => p.category === category.id).length;
                    return (
                      <div key={category.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{category.name}:</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Photos Gallery */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Fotos Capturadas</h2>
              
              {photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map(photo => (
                    <div 
                      key={photo.id}
                      className="group relative border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <img 
                        src={photo.src} 
                        alt={photo.caption}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                      
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="p-1 bg-red-600 rounded-full text-white hover:bg-red-700 focus:outline-none"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2">
                        <p className="text-white text-sm truncate">{photo.caption}</p>
                        <div className="flex items-center mt-1">
                          <Tag className="h-3 w-3 text-gray-300 mr-1" />
                          <span className="text-xs text-gray-300">
                            {categories.find(c => c.id === photo.category)?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <Image className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">Nenhuma foto adicionada</p>
                  <p className="text-gray-400 text-sm">
                    Use o painel lateral para adicionar fotos
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Link
          to="/nao-conformidades"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Voltar
        </Link>
        <button
          type="button"
          onClick={handleNext}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            photos.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          disabled={photos.length === 0}
        >
          Próximo
          <ChevronRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default PhotoCapture;