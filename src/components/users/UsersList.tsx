import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const users = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'Product Manager',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    role: 'Frontend Developer',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@example.com',
    role: 'Backend Developer',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Inactive',
  },
  {
    id: 4,
    name: 'Emily Wilson',
    email: 'emily.wilson@example.com',
    role: 'UI Designer',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Active',
  },
  {
    id: 5,
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'QA Engineer',
    imageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Active',
  },
];

const UsersList: React.FC = () => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {users.map(user => (
          <li key={user.id}>
            <div className="px-4 py-4 flex items-center sm:px-6">
              <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.imageUrl}
                    alt={user.name}
                  />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-4 flex-shrink-0 sm:mt-0">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">{user.role}</div>
                    <div>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-5 flex-shrink-0">
                <button
                  type="button"
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">View options</span>
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
