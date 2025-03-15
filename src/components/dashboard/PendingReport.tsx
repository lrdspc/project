import React from 'react';
import { Calendar, Clock, FileText } from 'lucide-react';

interface PendingReportProps {
  id: string;
  clientName: string;
  inspectionDate: string;
  daysOverdue: number;
  onClick?: () => void;
}

const PendingReport: React.FC<PendingReportProps> = ({
  id,
  clientName,
  inspectionDate,
  daysOverdue,
  onClick
}) => {
  const getUrgencyClass = (days: number) => {
    if (days > 5) return 'bg-red-100 text-red-800';
    if (days > 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div 
      className="flex items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer mb-2"
      onClick={onClick}
    >
      <div className="p-2 rounded-full bg-blue-50 mr-3">
        <FileText className="h-5 w-5 text-blue-500" />
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{clientName}</h3>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{inspectionDate}</span>
        </div>
      </div>
      
      <div className={`px-2 py-1 text-xs rounded-full font-medium ${getUrgencyClass(daysOverdue)}`}>
        {daysOverdue === 0 ? 'Hoje' : `${daysOverdue} dias`}
      </div>
    </div>
  );
};

export default PendingReport;