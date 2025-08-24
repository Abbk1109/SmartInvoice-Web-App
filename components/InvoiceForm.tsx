
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Trash2, Plus } from 'lucide-react';
import type { Invoice, InvoiceItem } from '../types';

interface InvoiceFormProps {
  initialInvoice?: Invoice;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
}

const emptyInvoice: Omit<Invoice, 'id' | 'invoiceNumber'> = {
  client: { name: '', email: '', address: '' },
  items: [{ id: `item-${Date.now()}`, description: '', quantity: 1, price: 0 }],
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: 'pending',
  taxRate: 0,
  discount: 0,
};

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ initialInvoice, onSave, onCancel }) => {
  const [invoice, setInvoice] = useState<Omit<Invoice, 'id' | 'invoiceNumber' > | Invoice>(initialInvoice || emptyInvoice);

  useEffect(() => {
    if (initialInvoice) {
      setInvoice(initialInvoice);
    }
  }, [initialInvoice]);

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, client: { ...prev.client, [name]: value } }));
  };
  
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...invoice.items];
    const itemToUpdate = { ...newItems[index] };
    (itemToUpdate[field] as string | number) = value;
    newItems[index] = itemToUpdate;
    setInvoice(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: `item-${Date.now()}`, description: '', quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    setInvoice(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: name === 'taxRate' || name === 'discount' ? parseFloat(value) || 0 : value }));
  };
  
  const subtotal = useMemo(() => invoice.items.reduce((acc, item) => acc + (item.quantity * item.price), 0), [invoice.items]);
  const taxAmount = (subtotal - invoice.discount) * (invoice.taxRate / 100);
  const total = subtotal - invoice.discount + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(invoice as Invoice);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Client Information</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="clientName">Client Name</label>
            <Input id="clientName" name="name" value={invoice.client.name} onChange={handleClientChange} required />
          </div>
          <div className="space-y-1">
            <label htmlFor="clientEmail">Client Email</label>
            <Input id="clientEmail" name="email" type="email" value={invoice.client.email} onChange={handleClientChange} required />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label htmlFor="clientAddress">Client Address</label>
            <Input id="clientAddress" name="address" value={invoice.client.address} onChange={handleClientChange} required />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label htmlFor="issueDate">Issue Date</label>
            <Input id="issueDate" name="issueDate" type="date" value={invoice.issueDate} onChange={handleMetaChange} required />
          </div>
          <div className="space-y-1">
            <label htmlFor="dueDate">Due Date</label>
            <Input id="dueDate" name="dueDate" type="date" value={invoice.dueDate} onChange={handleMetaChange} required />
          </div>
           <div className="space-y-1">
            <label htmlFor="status">Status</label>
             <select id="status" name="status" value={invoice.status} onChange={handleMetaChange} className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Items</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoice.items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5"><Input placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} required /></div>
                <div className="col-span-2"><Input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)} min="0" required /></div>
                <div className="col-span-2"><Input type="number" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)} min="0" step="0.01" required /></div>
                <div className="col-span-2 text-right font-medium text-sm text-muted-foreground">{(item.quantity * item.price).toFixed(2)}</div>
                <div className="col-span-1">
                    {invoice.items.length > 1 && <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                </div>
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={addItem} className="mt-4"><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
          <div className="w-full max-w-sm space-y-4">
              <div className="grid grid-cols-2 gap-4 items-center">
                  <label htmlFor="discount">Discount ($)</label>
                  <Input id="discount" name="discount" type="number" value={invoice.discount} onChange={handleMetaChange} className="text-right" />
              </div>
              <div className="grid grid-cols-2 gap-4 items-center">
                  <label htmlFor="taxRate">Tax Rate (%)</label>
                  <Input id="taxRate" name="taxRate" type="number" value={invoice.taxRate} onChange={handleMetaChange} className="text-right" />
              </div>
              <hr />
              <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
              </div>
          </div>
      </div>


      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Invoice</Button>
      </div>
    </form>
  );
};
   