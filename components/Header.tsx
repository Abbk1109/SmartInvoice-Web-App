
import React from 'react';
import { ChevronDown, User, Bell } from 'lucide-react';
import type { UserRole } from '../types';

interface HeaderProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({ userRole, onRoleChange }) => {
  return (
    <header className="h-20 bg-card border-b flex items-center justify-between px-8 flex-shrink-0">
      <div>
        <h2 className="text-xl font-semibold text-card-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Welcome back, here's a summary of your invoices.</p>
      </div>
      <div className="flex items-center space-x-6">
        <button className="text-muted-foreground hover:text-primary transition-colors">
          <Bell size={22} />
        </button>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <User size={20} className="text-muted-foreground" />
          </div>
          <div>
             <select
                value={userRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="text-sm font-semibold bg-transparent text-card-foreground focus:outline-none"
             >
                <option value="admin">Admin View</option>
                <option value="client">Client View (Innovate LLC)</option>
             </select>
            <p className="text-xs text-muted-foreground">
                {userRole === 'admin' ? 'Full Access' : 'Limited Access'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
   