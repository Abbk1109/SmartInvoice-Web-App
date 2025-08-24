
import { useState, useCallback } from 'react';
import { Invoice } from '../types';
import { MOCK_INVOICES } from '../constants';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);

  const addInvoice = useCallback((invoice: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
    };
    setInvoices(prev => [newInvoice, ...prev]);
  }, [invoices.length]);

  const updateInvoice = useCallback((updatedInvoice: Invoice) => {
    setInvoices(prev => prev.map(inv => (inv.id === updatedInvoice.id ? updatedInvoice : inv)));
  }, []);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  }, []);

  const markAsPaid = useCallback((id: string) => {
    setInvoices(prev => prev.map(inv => (inv.id === id ? { ...inv, status: 'paid' } : inv)));
  }, []);
  
  return { invoices, addInvoice, updateInvoice, deleteInvoice, markAsPaid };
};
   