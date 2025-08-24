
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { useInvoices } from './hooks/useInvoices';
import { UserRole, Invoice, View } from './types';

const App: React.FC = () => {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, markAsPaid } = useInvoices();
  const [currentView, setCurrentView] = useState<View>({ name: 'dashboard' });
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('admin');

  const handleCreateNew = useCallback(() => {
    setCurrentView({ name: 'form', invoiceId: undefined });
  }, []);

  const handleEditInvoice = useCallback((id: string) => {
    setCurrentView({ name: 'form', invoiceId: id });
  }, []);

  const handleViewInvoice = useCallback((id: string) => {
    setCurrentView({ name: 'preview', invoiceId: id });
  }, []);

  const handleSaveInvoice = useCallback((invoice: Invoice) => {
    if (invoice.id) {
      updateInvoice(invoice);
    } else {
      addInvoice(invoice);
    }
    setCurrentView({ name: 'dashboard' });
  }, [addInvoice, updateInvoice]);

  const handleCancel = useCallback(() => {
    setCurrentView({ name: 'dashboard' });
  }, []);

  const renderContent = () => {
    switch (currentView.name) {
      case 'dashboard':
        return (
          <Dashboard
            invoices={invoices}
            userRole={currentUserRole}
            onEdit={handleEditInvoice}
            onView={handleViewInvoice}
            onDelete={deleteInvoice}
            onCreateNew={handleCreateNew}
          />
        );
      case 'form':
        const invoiceToEdit = currentView.invoiceId ? invoices.find(inv => inv.id === currentView.invoiceId) : undefined;
        return <InvoiceForm initialInvoice={invoiceToEdit} onSave={handleSaveInvoice} onCancel={handleCancel} />;
      case 'preview':
        const invoiceToPreview = invoices.find(inv => inv.id === currentView.invoiceId);
        if (!invoiceToPreview) {
          setCurrentView({ name: 'dashboard' });
          return null;
        }
        return <InvoicePreview invoice={invoiceToPreview} onBack={() => setCurrentView({ name: 'dashboard' })} onMarkAsPaid={markAsPaid} userRole={currentUserRole} />;
      default:
        return <div>Unknown view</div>;
    }
  };

  return (
    <div className="flex h-screen bg-secondary text-primary-foreground">
      <Sidebar onNavigate={setCurrentView} userRole={currentUserRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={currentUserRole} onRoleChange={setCurrentUserRole} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-secondary p-6 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
   