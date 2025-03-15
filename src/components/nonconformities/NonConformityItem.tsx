import React, { useState } from 'react';
import { 
  Info, 
  Camera, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

interface NonConformityItemProps {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  details: string;
  onSelect: (id: number, isSelected: boolean) => void;
  onAddPhoto: (id: number) => void;
  onAddNote: (id: number, note: string) => void;
  isSelected?: boolean;
}

const NonConformityItem: React.FC<NonConformityItemProps> = ({
  id,
  title,
  description,
  icon,
  iconColor,
  iconBg,
  details,
  onSelect,
  onAddPhoto,
  onAddNote,
  isSelected = false
}) => {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState('');

  const handleSelect = () => {
    onSelect(id, !isSelected);
  };

  const handleAddPhoto = () => {
    onAddPhoto(id);
  };

  const handleAddNote = () => {
    onAddNote(id, note);
  };

  return (
    <div className={`mb-4 border rounded-lg transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${iconBg} p-2 rounded-lg mr-3`}>
            {icon}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setExpanded(!expanded)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  {expanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out cursor-pointer"
                    checked={isSelected}
                    onChange={handleSelect}
                  />
                </label>
              </div>
            </div>
            
            <p className="mt-1 text-sm text-gray-600">{description}</p>
            
            {expanded && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                    <p>{details}</p>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="mt-3 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observações
                      </label>
                      <textarea
                        rows={2}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Adicione observações específicas sobre esta não conformidade..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={handleAddNote}
                      >
                        Salvar Observações
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={handleAddPhoto}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Adicionar Foto
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonConformityItem;