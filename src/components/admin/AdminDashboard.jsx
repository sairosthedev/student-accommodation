
import React from 'react';
import { Wrench } from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    icon: <DashboardIcon className="w-5 h-5" />,
    path: '/admin/dashboard'
  },
  {
    name: 'Users',
    icon: <UsersIcon className="w-5 h-5" />,
    path: '/admin/users'
  },
  {
    name: 'Rooms',
    icon: <RoomsIcon className="w-5 h-5" />,
    path: '/admin/rooms'
  },
  {
    name: 'Applications',
    icon: <ApplicationsIcon className="w-5 h-5" />,
    path: '/admin/applications'
  },
  {
    name: 'Maintenance',
    icon: <Wrench className="w-5 h-5" />,
    path: '/admin/maintenance'
  }
];

export default navigationItems;