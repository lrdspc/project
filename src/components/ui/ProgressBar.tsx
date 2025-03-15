import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps,
  labels = []
}) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center ${index === 0 ? 'items-start' : ''} ${index === totalSteps - 1 ? 'items-end' : ''}`}
          >
            <div 
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                index + 1 <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
            {labels && labels[index] && (
              <span className="text-xs mt-1 text-gray-500">
                {labels[index]}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
          <div 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }} 
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
          />
        </div>
      </div>
      <div className="text-right text-sm mt-1 text-gray-500">
        Etapa {currentStep} de {totalSteps}
      </div>
    </div>
  );
};

export default ProgressBar;