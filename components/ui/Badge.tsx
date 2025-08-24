
import React from 'react';
import type { Invoice } from '../../types';

interface BadgeProps {
  status: Invoice['status'];
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

  const statusStyles: Record<Invoice['status'], string> = {
    paid: 'bg-green-100 text-green-800 border-transparent',
    pending: 'bg-yellow-100 text-yellow-800 border-transparent',
    overdue: 'bg-red-100 text-red-800 border-transparent',
  };

  const statusText: Record<Invoice['status'], string> = {
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
  };

  return (
    <div className={`${baseClasses} ${statusStyles[status]}`}>
      {statusText[status]}
    </div>
  );
};
   