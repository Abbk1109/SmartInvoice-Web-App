
import React, { useRef, useMemo, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { ArrowLeft, Download, CreditCard, Loader2 } from 'lucide-react';
import type { Invoice, UserRole } from '../types';

interface InvoicePreviewProps {
  invoice: Invoice;
  onBack: () => void;
  onMarkAsPaid: (id: string) => void;
  userRole: UserRole;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, onBack, onMarkAsPaid, userRole }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const subtotal = useMemo(() => invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0), [invoice.items]);
  const taxAmount = (subtotal - invoice.discount) * (invoice.taxRate / 100);
  const total = subtotal - invoice.discount + taxAmount;

  const downloadPdf = async () => {
    if (!invoiceRef.current) return;
    setIsDownloading(true);
    try {
        const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
    } catch (error) {
        console.error("Failed to generate PDF", error);
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <div className="flex space-x-2">
            {userRole === 'admin' && invoice.status !== 'paid' &&
                <Button variant="secondary" onClick={() => onMarkAsPaid(invoice.id)}>
                    <CreditCard className="mr-2 h-4 w-4" /> Mark as Paid
                </Button>
            }
          <Button onClick={downloadPdf} disabled={isDownloading}>
            {isDownloading ? (
                <>
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 Downloading...
                </>
            ) : (
                <>
                 <Download className="mr-2 h-4 w-4" />
                 Download PDF
                </>
            )}
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div ref={invoiceRef} className="p-10 bg-white text-black">
            <header className="flex justify-between items-start pb-8 border-b">
              <div>
                <h1 className="text-4xl font-bold text-primary">INVOICE</h1>
                <p className="text-gray-500">{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-semibold">SmartInvoice Inc.</h2>
                <p className="text-gray-600">123 App Street, Suite 100<br/>Dev City, DC 12345</p>
              </div>
            </header>

            <section className="grid grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
                <p className="font-bold">{invoice.client.name}</p>
                <p className="text-gray-600">{invoice.client.address}</p>
                <p className="text-gray-600">{invoice.client.email}</p>
              </div>
              <div className="text-right">
                <div className="grid grid-cols-2">
                  <span className="font-semibold">Issue Date:</span>
                  <span>{new Date(invoice.issueDate).toLocaleDateString()}</span>
                  <span className="font-semibold">Due Date:</span>
                  <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                  <span className="font-semibold mt-4">Status:</span>
                   <div className="flex justify-end mt-4"><Badge status={invoice.status} /></div>
                </div>
              </div>
            </section>

            <section className="mt-10">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-sm font-semibold uppercase">Description</th>
                    <th className="p-3 text-sm font-semibold uppercase text-center">Qty</th>
                    <th className="p-3 text-sm font-semibold uppercase text-right">Unit Price</th>
                    <th className="p-3 text-sm font-semibold uppercase text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map(item => (
                    <tr key={item.id} className="border-b">
                      <td className="p-3">{item.description}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">{item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                      <td className="p-3 text-right">{(item.quantity * item.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            
            <section className="mt-8 flex justify-end">
              <div className="w-full max-w-xs space-y-2 text-gray-700">
                <div className="flex justify-between"><span>Subtotal</span><span>{subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></div>
                {invoice.discount > 0 && <div className="flex justify-between"><span>Discount</span><span>- {invoice.discount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></div>}
                <div className="flex justify-between"><span>Tax ({invoice.taxRate}%)</span><span>{taxAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></div>
                <hr className="my-2"/>
                <div className="flex justify-between font-bold text-xl text-primary"><span>Total</span><span>{total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></div>
              </div>
            </section>

            <footer className="mt-12 pt-6 border-t">
                <h4 className="font-semibold mb-2">Payment Details</h4>
                <p className="text-sm text-gray-600">Paystack Secure Payment | Account: 1234567890 | Bank: Dev Bank</p>
                <p className="text-sm text-gray-600 mt-4">Thank you for your business!</p>
            </footer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
   