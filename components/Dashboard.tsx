
import React, { useMemo } from 'react';
import { PlusCircle, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import type { Invoice, UserRole } from '../types';

interface DashboardProps {
  invoices: Invoice[];
  userRole: UserRole;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

const InvoiceRow: React.FC<{invoice: Invoice, onEdit: (id: string) => void, onView: (id: string) => void, onDelete: (id: string) => void, userRole: UserRole }> = ({ invoice, onEdit, onView, onDelete, userRole }) => {
    const subtotal = useMemo(() => invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0), [invoice.items]);
    const total = subtotal - invoice.discount + (subtotal - invoice.discount) * (invoice.taxRate / 100);
    
    return (
        <tr className="border-b transition-colors hover:bg-muted/50">
            <td className="p-4 align-middle font-medium">{invoice.invoiceNumber}</td>
            <td className="p-4 align-middle">{invoice.client.name}</td>
            <td className="p-4 align-middle">{new Date(invoice.dueDate).toLocaleDateString()}</td>
            <td className="p-4 align-middle text-right">{total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
            <td className="p-4 align-middle"><Badge status={invoice.status} /></td>
            <td className="p-4 align-middle text-right">
                <div className="relative">
                    <button className="p-2 hover:bg-gray-200 rounded-full group" onClick={(e) => e.currentTarget.nextElementSibling?.classList.toggle('hidden')}>
                         <MoreVertical size={16} />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg z-10 hidden border">
                        <button onClick={() => onView(invoice.id)} className="flex items-center w-full px-4 py-2 text-sm text-left text-card-foreground hover:bg-secondary">
                            <Eye size={14} className="mr-2"/> View Details
                        </button>
                        {userRole === 'admin' && (
                            <>
                                <button onClick={() => onEdit(invoice.id)} className="flex items-center w-full px-4 py-2 text-sm text-left text-card-foreground hover:bg-secondary">
                                    <Edit size={14} className="mr-2"/> Edit
                                </button>
                                <button onClick={() => onDelete(invoice.id)} className="flex items-center w-full px-4 py-2 text-sm text-left text-destructive hover:bg-secondary">
                                    <Trash2 size={14} className="mr-2"/> Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ invoices, userRole, onEdit, onView, onDelete, onCreateNew }) => {
    const filteredInvoices = useMemo(() => {
        if (userRole === 'client') {
            return invoices.filter(inv => inv.client.name === 'Innovate LLC');
        }
        return invoices;
    }, [invoices, userRole]);

    const totalRevenue = useMemo(() => filteredInvoices.filter(inv => inv.status === 'paid').reduce((acc, inv) => {
        const subtotal = inv.items.reduce((s, i) => s + i.price * i.quantity, 0);
        return acc + subtotal - inv.discount + (subtotal - inv.discount) * (inv.taxRate / 100);
    }, 0), [filteredInvoices]);

    const pendingAmount = useMemo(() => filteredInvoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue').reduce((acc, inv) => {
        const subtotal = inv.items.reduce((s, i) => s + i.price * i.quantity, 0);
        return acc + subtotal - inv.discount + (subtotal - inv.discount) * (inv.taxRate / 100);
    }, 0), [filteredInvoices]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
                {userRole === 'admin' && (
                    <Button onClick={onCreateNew}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Create New Invoice
                    </Button>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Revenue" value={totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} icon={<span className="text-green-500">✔</span>} />
                <StatCard title="Pending Amount" value={pendingAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} icon={<span className="text-yellow-500">!</span>} />
                <StatCard title="Total Invoices" value={filteredInvoices.length.toString()} icon={<span className="text-blue-500">#</span>} />
                <StatCard title="Overdue" value={filteredInvoices.filter(i => i.status === 'overdue').length.toString()} icon={<span className="text-red-500">⚠</span>} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                         <table className="w-full caption-bottom text-sm">
                            <thead className="border-b">
                                <tr className="text-left">
                                    <th className="h-12 px-4 font-medium text-muted-foreground">Invoice #</th>
                                    <th className="h-12 px-4 font-medium text-muted-foreground">Client</th>
                                    <th className="h-12 px-4 font-medium text-muted-foreground">Due Date</th>
                                    <th className="h-12 px-4 font-medium text-muted-foreground text-right">Amount</th>
                                    <th className="h-12 px-4 font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 font-medium text-muted-foreground text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map(invoice => (
                                    <InvoiceRow key={invoice.id} invoice={invoice} onEdit={onEdit} onView={onView} onDelete={onDelete} userRole={userRole} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
   