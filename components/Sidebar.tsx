import React from 'react';
import { AppState, User } from '../types';
import { GraduationCapIcon } from './icons/GraduationCapIcon';
import { DashboardIcon } from './icons/DashboardIcon';
import { UploadIcon } from './icons/UploadIcon';
import { ReviewCardsIcon } from './icons/ReviewCardsIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { ListIcon } from './icons/ListIcon';

interface SidebarProps {
  activeState: AppState;
  onNavigate: (state: AppState) => void;
  batchCount: number;
  user: User | null;
  onLogout: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}> = ({ icon, label, isActive, onClick, count }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
        : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'
    }`}
  >
    <div className="flex items-center space-x-3">
        {icon}
        <span>{label}</span>
    </div>
    {typeof count !== 'undefined' && count > 0 && (
        <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${isActive ? 'bg-white text-indigo-600' : 'bg-gray-200 text-gray-600'}`}>
            {count}
        </span>
    )}
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeState, onNavigate, batchCount, user, onLogout }) => {
  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col p-4">
      <div className="flex items-center space-x-3 p-3 mb-6">
        <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2 rounded-lg">
          <GraduationCapIcon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">ReportCard Pro</h1>
          <p className="text-xs text-gray-500">Teacher Portal</p>
        </div>
      </div>

      <nav className="flex flex-col space-y-2">
        <p className="text-xs font-bold text-gray-400 uppercase px-4 py-2">Navigation</p>
        <NavItem
          icon={<DashboardIcon className="w-6 h-6" />}
          label="Dashboard"
          isActive={activeState === 'dashboard'}
          onClick={() => onNavigate('dashboard')}
        />
        <NavItem
          icon={<UploadIcon className="w-6 h-6" />}
          label="Upload Marks"
          isActive={activeState === 'upload'}
          onClick={() => onNavigate('upload')}
        />
        <NavItem
          icon={<ListIcon className="w-6 h-6" />}
          label="Class Reports"
          isActive={activeState === 'class_reports'}
          onClick={() => onNavigate('class_reports')}
          count={batchCount}
        />
        <NavItem
          icon={<ReviewCardsIcon className="w-6 h-6" />}
          label="Review Cards"
          isActive={activeState === 'review'}
          onClick={() => onNavigate('review')}
        />
      </nav>

      <div className="mt-auto">
        <div className="w-full h-px bg-gray-200 my-4"></div>
        {user && (
            <div className="flex items-center space-x-3 p-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-indigo-600 text-lg">
                {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
                <p className="font-semibold text-sm text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">{user.school}</p>
            </div>
            </div>
        )}
        <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded-lg font-semibold transition-colors duration-200 mt-2">
          <LogoutIcon className="w-6 h-6" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;