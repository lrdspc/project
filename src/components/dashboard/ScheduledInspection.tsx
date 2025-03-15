import React from 'react';
import { MapPin, Clock, User, Building2 } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

interface ScheduledInspectionProps {
  id: string;
  clientName: string;
  location: string;
  buildingType: string;
  dateTime: string;
  status: 'confirmed' | 'pending' | 'delayed';
  onClick?: () => void;
}

const ScheduledInspection: React.FC<ScheduledInspectionProps> = ({
  id,
  clientName,
  location,
  buildingType,
  dateTime,
  status,
  onClick
}) => {
  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer mb-3"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{clientName}</h3>
          <p className="text-sm text-gray-500">ID: #{id}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      
      <div className="space-y-2 mt-3">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
          <span>{location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Building2 className="h-4 w-4 mr-2 text-gray-400" />
          <span>{buildingType}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2 text-gray-400" />
          <span>{dateTime}</span>
        </div>
      </div>
    </div>
  );
};

export default ScheduledInspection;