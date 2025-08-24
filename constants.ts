
import { Invoice } from './types';

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2024-001',
    client: {
      name: 'Innovate LLC',
      email: 'contact@innovatellc.com',
      address: '123 Tech Park, Silicon Valley, CA 94000',
    },
    items: [
      { id: 'item-1', description: 'Web Development Services', quantity: 40, price: 150 },
      { id: 'item-2', description: 'UI/UX Design Mockups', quantity: 1, price: 2500 },
    ],
    issueDate: '2024-07-01',
    dueDate: '2024-07-31',
    status: 'paid',
    taxRate: 8.5,
    discount: 500,
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2024-002',
    client: {
      name: 'Solutions Co.',
      email: 'accounts@solutionsco.com',
      address: '456 Business Blvd, New York, NY 10001',
    },
    items: [
      { id: 'item-3', description: 'Cloud Migration Consulting', quantity: 1, price: 7500 },
      { id: 'item-4', description: 'Monthly Server Maintenance', quantity: 1, price: 800 },
    ],
    issueDate: '2024-07-15',
    dueDate: '2024-08-14',
    status: 'pending',
    taxRate: 6.0,
    discount: 0,
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2024-003',
    client: {
      name: 'Innovate LLC',
      email: 'contact@innovatellc.com',
      address: '123 Tech Park, Silicon Valley, CA 94000',
    },
    items: [
        { id: 'item-5', description: 'Automated Testing Suite', quantity: 1, price: 4200 },
    ],
    issueDate: '2024-06-01',
    dueDate: '2024-06-30',
    status: 'overdue',
    taxRate: 8.5,
    discount: 0,
  },
  {
    id: 'inv-004',
    invoiceNumber: 'INV-2024-004',
    client: {
      name: 'Creative Minds Agency',
      email: 'billing@creativeminds.io',
      address: '789 Design District, Miami, FL 33101',
    },
    items: [
      { id: 'item-6', description: 'Brand Identity Package', quantity: 1, price: 5000 },
      { id: 'item-7', description: 'Social Media Assets', quantity: 20, price: 75 },
    ],
    issueDate: '2024-07-20',
    dueDate: '2024-08-19',
    status: 'pending',
    taxRate: 7.0,
    discount: 250,
  },
];
   