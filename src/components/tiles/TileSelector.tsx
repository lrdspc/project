import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

export interface TileSelection {
  id: string;
  line: string;
  thickness: string;
  dimensions: string;
  quantity: number;
  area: number;
}

interface TileSelectorProps {
  onAdd: (tile: TileSelection) => void;
}

const TileSelector: React.FC<TileSelectorProps> = ({ onAdd }) => {
  const [line, setLine] = useState<string>('');
  const [thickness, setThickness] = useState<string>('');
  const [dimensions, setDimensions] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);
  const [area, setArea] = useState<number>(0);

  // Tile line options
  const tileLines = [
    { id: 'ondulada', name: 'Ondulada' },
    { id: 'topcomfort', name: 'TopComfort' },
    { id: 'tropical', name: 'Tropical' },
    { id: 'estrutural', name: 'Estrutural' },
  ];

  // Thickness options based on selected line
  const getThicknessOptions = (selectedLine: string) => {
    switch (selectedLine) {
      case 'ondulada':
        return [
          { id: '4mm', name: '4mm' },
          { id: '5mm', name: '5mm' },
          { id: '6mm', name: '6mm' },
          { id: '8mm', name: '8mm' },
        ];
      case 'topcomfort':
        return [
          { id: '6mm', name: '6mm' },
          { id: '8mm', name: '8mm' },
        ];
      case 'tropical':
        return [
          { id: '5mm', name: '5mm' },
          { id: '6mm', name: '6mm' },
        ];
      case 'estrutural':
        return [
          { id: '6mm', name: '6mm' },
          { id: '8mm', name: '8mm' },
        ];
      default:
        return [];
    }
  };

  // Dimensions options based on selected line and thickness
  const getDimensionsOptions = (selectedLine: string, selectedThickness: string) => {
    if (!selectedLine || !selectedThickness) return [];

    // This is a simplified mapping for demonstration
    if (selectedLine === 'ondulada') {
      if (selectedThickness === '4mm') {
        return [
          { id: '1.22x0.50', name: '1.22m x 0.50m', area: 0.61 },
          { id: '1.53x0.50', name: '1.53m x 0.50m', area: 0.765 },
          { id: '1.83x0.50', name: '1.83m x 0.50m', area: 0.915 },
        ];
      } else if (selectedThickness === '5mm' || selectedThickness === '6mm') {
        return [
          { id: '1.83x1.10', name: '1.83m x 1.10m', area: 2.013 },
          { id: '2.13x1.10', name: '2.13m x 1.10m', area: 2.343 },
          { id: '2.44x1.10', name: '2.44m x 1.10m', area: 2.684 },
        ];
      } else if (selectedThickness === '8mm') {
        return [
          { id: '3.05x1.10', name: '3.05m x 1.10m', area: 3.355 },
          { id: '3.66x1.10', name: '3.66m x 1.10m', area: 4.026 },
        ];
      }
    } else if (selectedLine === 'topcomfort') {
      return [
        { id: '2.00x0.95', name: '2.00m x 0.95m', area: 1.9 },
        { id: '2.20x0.95', name: '2.20m x 0.95m', area: 2.09 },
        { id: '2.40x0.95', name: '2.40m x 0.95m', area: 2.28 },
      ];
    } else if (selectedLine === 'tropical') {
      return [
        { id: '1.83x0.90', name: '1.83m x 0.90m', area: 1.647 },
        { id: '2.13x0.90', name: '2.13m x 0.90m', area: 1.917 },
      ];
    } else if (selectedLine === 'estrutural') {
      return [
        { id: '2.30x0.92', name: '2.30m x 0.92m', area: 2.116 },
        { id: '3.00x0.92', name: '3.00m x 0.92m', area: 2.76 },
      ];
    }

    return [];
  };

  const handleDimensionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDimensions = e.target.value;
    setDimensions(selectedDimensions);
    
    // Find the area for the selected dimension
    const dimensionOptions = getDimensionsOptions(line, thickness);
    const selectedDimensionObj = dimensionOptions.find(d => d.id === selectedDimensions);
    
    if (selectedDimensionObj && quantity > 0) {
      setArea(+(selectedDimensionObj.area * quantity).toFixed(2));
    } else {
      setArea(0);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10) || 0;
    setQuantity(newQuantity);
    
    // Update area based on the new quantity
    const dimensionOptions = getDimensionsOptions(line, thickness);
    const selectedDimensionObj = dimensionOptions.find(d => d.id === dimensions);
    
    if (selectedDimensionObj) {
      setArea(+(selectedDimensionObj.area * newQuantity).toFixed(2));
    }
  };

  const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLine(e.target.value);
    setThickness('');
    setDimensions('');
    setArea(0);
  };

  const handleThicknessChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setThickness(e.target.value);
    setDimensions('');
    setArea(0);
  };

  const handleReset = () => {
    setLine('');
    setThickness('');
    setDimensions('');
    setQuantity(0);
    setArea(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!line || !thickness || !dimensions || quantity <= 0) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }
    
    // Find display names for the form values
    const lineObj = tileLines.find(l => l.id === line);
    const thicknessObj = getThicknessOptions(line).find(t => t.id === thickness);
    const dimensionsObj = getDimensionsOptions(line, thickness).find(d => d.id === dimensions);
    
    const tile: TileSelection = {
      id: Date.now().toString(),
      line: lineObj?.name || line,
      thickness: thicknessObj?.name || thickness,
      dimensions: dimensionsObj?.name || dimensions,
      quantity,
      area
    };
    
    onAdd(tile);
    handleReset();
  };

  const isFormValid = () => {
    return line && thickness && dimensions && quantity > 0;
  };

  const thicknessOptions = getThicknessOptions(line);
  const dimensionsOptions = getDimensionsOptions(line, thickness);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tile Line Selection */}
        <div>
          <label htmlFor="line" className="block text-sm font-medium text-gray-700 mb-1">
            Linha
          </label>
          <select
            id="line"
            name="line"
            value={line}
            onChange={handleLineChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Selecione a linha</option>
            {tileLines.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* Thickness Selection */}
        <div>
          <label htmlFor="thickness" className="block text-sm font-medium text-gray-700 mb-1">
            Espessura
          </label>
          <select
            id="thickness"
            name="thickness"
            value={thickness}
            onChange={handleThicknessChange}
            disabled={!line}
            className={`block w-full rounded-md ${
              !line ? 'bg-gray-100 cursor-not-allowed' : ''
            } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          >
            <option value="">Selecione a espessura</option>
            {thicknessOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dimensions Selection */}
        <div>
          <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-1">
            Dimensões
          </label>
          <select
            id="dimensions"
            name="dimensions"
            value={dimensions}
            onChange={handleDimensionsChange}
            disabled={!thickness}
            className={`block w-full rounded-md ${
              !thickness ? 'bg-gray-100 cursor-not-allowed' : ''
            } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          >
            <option value="">Selecione as dimensões</option>
            {dimensionsOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quantity Input */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantidade
          </label>
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity(prev => (prev > 0 ? prev - 1 : 0))}
              disabled={!dimensions}
              className={`inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-gray-500 ${
                !dimensions ? 'cursor-not-allowed' : 'hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">-</span>
            </button>
            <input
              type="number"
              name="quantity"
              id="quantity"
              min="0"
              value={quantity}
              onChange={handleQuantityChange}
              disabled={!dimensions}
              className={`block w-full border-gray-300 text-center ${
                !dimensions ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setQuantity(prev => prev + 1)}
              disabled={!dimensions}
              className={`inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 ${
                !dimensions ? 'cursor-not-allowed' : 'hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">+</span>
            </button>
          </div>
        </div>

        {/* Area Calculation */}
        <div>
          <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
            Área Total (m²)
          </label>
          <input
            type="text"
            name="area"
            id="area"
            value={area}
            disabled
            className="block w-full rounded-md border-gray-300 bg-gray-100 cursor-not-allowed shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <X className="mr-2 h-4 w-4" />
          Limpar
        </button>
        <button
          type="submit"
          disabled={!isFormValid()}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            isFormValid() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Telha
        </button>
      </div>
    </form>
  );
};

export default TileSelector;