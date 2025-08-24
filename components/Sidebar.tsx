
import React from 'react';
import { LayoutDashboard, FilePlus2, Settings, FileText } from 'lucide-react';
import type { UserRole, View } from '../types';

interface SidebarProps {
  userRole: UserRole;
  onNavigate: (view: View) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200">
    {icon}
    <span className="ml-4">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ userRole, onNavigate }) => {
  return (
    <div className="w-64 bg-primary text-primary-foreground flex-shrink-0 flex flex-col">
      <div className="h-20 flex items-center justify-center border-b border-gray-700">
        <FileText className="h-8 w-8 text-indigo-400" />
        <h1 className="ml-3 text-2xl font-bold text-white">SmartInvoice</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => onNavigate({ name: 'dashboard' })} />
        {userRole === 'admin' && (
          <NavItem icon={<FilePlus2 size={20} />} label="Create Invoice" onClick={() => onNavigate({ name: 'form' })} />
        )}
        <NavItem icon={<Settings size={20} />} label="Settings" onClick={() => {}} />
      </nav>
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">&copy; 2024 SmartInvoice Inc.</p>
      </div>
    </div>
  );
};
   