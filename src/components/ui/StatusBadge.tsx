import React from 'react';

type StatusType = 'confirmed' | 'pending' | 'delayed' | 'completed';

interface StatusBadgeProps {
  status: StatusType;
  text?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  text 
}) => {
  const getStatusStyles = (status: StatusType) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: StatusType) => {
    if (text) return text;
    
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'delayed':
        return 'Atrasado';
      case 'completed':
        return 'Concluído';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(status)}`}>
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;