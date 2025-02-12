import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  X, 
  CreditCard, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const INVOICE_TYPES = {
  RENT: 'Rent',
  UTILITIES: 'Utilities',
  MAINTENANCE: 'Maintenance',
  OTHER: 'Other'
};

const BillingSystem = ({ studentId, isAdmin }) => {
  const [invoices, setInvoices] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newInvoice, setNewInvoice] = useState({
    amount: '',
    dueDate: '',
    description: '',
    type: 'RENT',
  });

  useEffect(() => {
    fetchInvoices();
  }, [studentId]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      // Simulated API call for demo
      const response = {
        data: [
          {
            id: 1,
            type: 'RENT',
            description: 'January Rent',
            amount: 1200,
            dueDate: '2025-01-31',
            paid: false
          },
          {
            id: 2,
            type: 'UTILITIES',
            description: 'January Utilities',
            amount: 150,
            dueDate: '2025-01-31',
            paid: true
          }
        ]
      };
      setInvoices(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
      setError('Failed to fetch invoices');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    try {
      setError(null);
      const response = {
        data: {
          id: invoices.length + 1,
          ...newInvoice,
          amount: parseFloat(newInvoice.amount),
          paid: false
        }
      };
      
      setShowInvoiceModal(false);
      setNewInvoice({
        amount: '',
        dueDate: '',
        description: '',
        type: 'RENT',
      });
      
      setInvoices(prevInvoices => [...prevInvoices, response.data]);
    } catch (err) {
      console.error('Failed to create invoice:', err);
      setError('Failed to create invoice');
    }
  };

  const handlePayment = async (invoiceId) => {
    try {
      setError(null);
      setInvoices(prevInvoices =>
        prevInvoices.map(invoice =>
          invoice.id === invoiceId ? { ...invoice, paid: true } : invoice
        )
      );
    } catch (err) {
      console.error('Payment processing failed:', err);
      setError('Payment processing failed');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const Modal = ({ children, show, onClose, title }) => {
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  const getStatusColor = (invoice) => {
    return invoice.paid 
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (invoice) => {
    return invoice.paid ? 'Paid' : 'Pending';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices
    .filter(invoice => invoice.paid)
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6 md:ml-0 w-full">
        <div className="md:p-4">
          <h1 className="text-2xl font-bold mb-4">Billing & Payments</h1>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="py-2 text-left">ID</th>
                        <th className="py-2 text-left">Type</th>
                        <th className="py-2 text-left">Description</th>
                        <th className="py-2 text-left">Amount</th>
                        <th className="py-2 text-left">Due Date</th>
                        <th className="py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b last:border-b-0">
                          <td className="py-2">#{invoice.id}</td>
                          <td className="py-2">{INVOICE_TYPES[invoice.type]}</td>
                          <td className="py-2">{invoice.description}</td>
                          <td className="py-2">{formatCurrency(invoice.amount)}</td>
                          <td className="py-2">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice)}`}>
                              {getStatusText(invoice)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Invoice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <select
                    value={newInvoice.type}
                    onChange={(e) => setNewInvoice({...newInvoice, type: e.target.value})}
                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-black focus:ring-black"
                  >
                    {Object.entries(INVOICE_TYPES).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                    placeholder="Enter amount"
                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-black focus:ring-black"
                  />

                  <input
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-black focus:ring-black"
                  />

                  <textarea
                    value={newInvoice.description}
                    onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                    placeholder="Enter description"
                    rows={3}
                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-black focus:ring-black"
                  />

                  <button
                    onClick={handleCreateInvoice}
                    className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900"
                  >
                    Create Invoice
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSystem;