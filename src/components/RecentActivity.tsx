import React from 'react';
import { UserCircle, FileText, MessageSquare, Calendar, CircleDollarSign } from 'lucide-react';

const activities = [
  {
    id: 1,
    user: 'Sarah Johnson',
    action: 'completed task',
    subject: 'Website redesign',
    time: '2 hours ago',
    icon: FileText,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-100',
  },
  {
    id: 2,
    user: 'Michael Chen',
    action: 'commented on',
    subject: 'Q3 Marketing Plan',
    time: '5 hours ago',
    icon: MessageSquare,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-100',
  },
  {
    id: 3,
    user: 'Alex Rodriguez',
    action: 'scheduled meeting with',
    subject: 'Design Team',
    time: 'Yesterday',
    icon: Calendar,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-100',
  },
  {
    id: 4,
    user: 'Emily Wilson',
    action: 'processed payment for',
    subject: 'Project Alpha',
    time: 'Yesterday',
    icon: CircleDollarSign,
    iconColor: 'text-yellow-500',
    iconBg: 'bg-yellow-100',
  },
  {
    id: 5,
    user: 'David Kim',
    action: 'joined the team as',
    subject: 'Frontend Developer',
    time: '2 days ago',
    icon: UserCircle,
    iconColor: 'text-indigo-500',
    iconBg: 'bg-indigo-100',
  },
];

const RecentActivity: React.FC = () => {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, activityIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div className={`relative p-2 ${activity.iconBg} rounded-full`}>
                  <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm">
                      <a href="#" className="font-medium text-gray-900">
                        {activity.user}
                      </a>{' '}
                      <span className="text-gray-500">
                        {activity.action}{' '}
                        <a href="#" className="font-medium text-gray-900">
                          {activity.subject}
                        </a>
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;