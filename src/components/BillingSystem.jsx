import React from 'react';
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

const INVOICE_TYPES = {
  RENT: 'Rent',
  UTILITIES: 'Utilities',
  MAINTENANCE: 'Maintenance',
  OTHER: 'Other'
};

const BillingSystem = ({ studentId, isAdmin }) => {
  const [invoices, setInvoices] = React.useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [newInvoice, setNewInvoice] = React.useState({
    amount: '',
    dueDate: '',
    description: '',
    type: 'RENT',
  });

  React.useEffect(() => {
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black text-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-2">
              Billing & Payments
            </h1>
            <p className="text-gray-300">
              Manage invoices and track payments
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Paid Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(paidAmount)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(pendingAmount)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-black focus:ring-black"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <button className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <Filter className="h-5 w-5 text-gray-600 mr-2" />
                  <span>Filter</span>
                </button>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  <span>Create Invoice</span>
                </button>
              )}
            </div>
          </div>

          {/* Table Header */}
          <div className="hidden md:grid grid-cols-7 gap-4 p-4 bg-gray-50 text-sm font-medium text-gray-600">
            <div>Invoice #</div>
            <div>Type</div>
            <div>Description</div>
            <div>Amount</div>
            <div>Due Date</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {/* Table Content */}
          <div className="divide-y divide-gray-100">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 hover:bg-gray-50 transition-colors items-center">
                <div className="text-sm text-gray-900">#{invoice.id}</div>
                <div className="text-sm text-gray-900">{INVOICE_TYPES[invoice.type]}</div>
                <div className="text-sm text-gray-900">{invoice.description}</div>
                <div className="text-sm text-gray-900">{formatCurrency(invoice.amount)}</div>
                <div className="text-sm text-gray-600">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice)}`}>
                    {getStatusText(invoice)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {!invoice.paid && (
                    <button
                      onClick={() => handlePayment(invoice.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-sm rounded-lg hover:bg-gray-900"
                    >
                      <CreditCard className="h-4 w-4" />
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            ))}

            {invoices.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No invoices found</div>
                <p className="text-gray-400 mt-2">No billing records available at the moment</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Invoice Modal */}
      <Modal
        show={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        title="Create New Invoice"
      >
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newInvoice.type}
                onChange={(e) => setNewInvoice({...newInvoice, type: e.target.value})}
                className="w-full rounded-lg border-gray-200 shadow-sm focus:border-black focus:ring-black"
              >
                {Object.entries(INVOICE_TYPES).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newInvoice.amount}
                onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                placeholder="Enter amount"
                className="w-full rounded-lg border-gray-200 shadow-sm focus:border-black focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={newInvoice.dueDate}
                onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                className="w-full rounded-lg border-gray-200 shadow-sm focus:border-black focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newInvoice.description}
                onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                placeholder="Enter description"
                rows={3}
                className="w-full rounded-lg border-gray-200 shadow-sm focus:border-black focus:ring-black"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateInvoice}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BillingSystem;