
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Client {
  name: string;
  email: string;
  address: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: Client;
  items: InvoiceItem[];
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  taxRate: number;
  discount: number;
}

export type UserRole = 'admin' | 'client';

export type View = 
  | { name: 'dashboard' }
  | { name: 'form', invoiceId?: string }
  | { name: 'preview', invoiceId: string };
   