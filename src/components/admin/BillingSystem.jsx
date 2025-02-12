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
import instance from '../../services/api';
import { toast } from 'react-hot-toast';

const INVOICE_TYPES = {
  RENT: 'rent',
  UTILITIES: 'utilities',
  MAINTENANCE: 'maintenance',
  OTHER: 'other'
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
    type: 'rent',
    studentName: '',
    studentEmail: '',
    studentId: '',
    status: 'pending',
    paid: false
  });

  const [activeTab, setActiveTab] = useState('list');

  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await instance.get('/payments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Transform the data to ensure consistent status
      const transformedInvoices = Array.isArray(response.data) 
        ? response.data.map(invoice => ({
            ...invoice,
            paid: invoice.status === 'paid' || invoice.paid, // Handle both status and paid flag
            status: invoice.status || (invoice.paid ? 'paid' : 'pending')
          }))
        : [];
      
      console.log('Fetched Invoices:', transformedInvoices);
      setInvoices(transformedInvoices);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
      setError('Failed to fetch invoices');
      setInvoices([]);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const validateInvoice = () => {
    const { amount, dueDate, description, type } = newInvoice;
    
    if (!amount || !dueDate || !description) {
      setError('Amount, due date, and description are required.');
      return false;
    }
    
    if (type === INVOICE_TYPES.RENT) {
      const { studentName, studentEmail, studentId } = newInvoice;
      if (!studentName || !studentEmail || !studentId) {
        setError('Student name, email, and ID are required for Rent invoices.');
        return false;
      }
    }
    
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Amount must be a positive number.');
      return false;
    }
    
    return true;
  };

  const handleCreateInvoice = async () => {
    if (!validateInvoice()) return;
    try {
      setError(null);
      const token = localStorage.getItem('auth_token');
      
      // Format the amount as a number
      const amountAsNumber = parseFloat(newInvoice.amount);
      
      // Create base payload
      const payload = {
        amount: amountAsNumber,
        dueDate: new Date(newInvoice.dueDate).toISOString(),
        description: newInvoice.description,
        paymentType: newInvoice.type.toLowerCase(),
        status: 'pending',
        paid: false,
        // Always include student fields, they'll be null/empty for non-rent payments
        studentId: newInvoice.type === INVOICE_TYPES.RENT ? newInvoice.studentId : null,
        studentName: newInvoice.type === INVOICE_TYPES.RENT ? newInvoice.studentName : null,
        studentEmail: newInvoice.type === INVOICE_TYPES.RENT ? newInvoice.studentEmail : null
      };

      console.log('Sending payload:', payload);

      const response = await instance.post('/payments', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      setShowInvoiceModal(false);
      setNewInvoice({
        amount: '',
        dueDate: '',
        description: '',
        type: 'rent',
        studentName: '',
        studentEmail: '',
        studentId: '',
        status: 'pending',
        paid: false
      });
      setInvoices(prevInvoices => [...prevInvoices, response.data]);
    } catch (err) {
      console.error('Failed to create invoice:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to create invoice');
    }
  };

  const handlePayment = async (invoiceId) => {
    try {
      setError(null);
      const token = localStorage.getItem('auth_token');
      
      // Send payment update to backend
      await instance.put(`/payments/${invoiceId}/payment`, 
        { paid: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      // Update local state after successful backend update
      setInvoices(prevInvoices =>
        prevInvoices.map(invoice =>
          invoice._id === invoiceId ? { ...invoice, paid: true } : invoice
        )
      );
    } catch (err) {
      console.error('Payment processing failed:', err);
      setError(err.response?.data?.message || 'Payment processing failed');
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
    return (invoice.status === 'paid' || invoice.paid)
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (invoice) => {
    return invoice.status === 'paid' || invoice.paid ? 'Paid' : 'Pending';
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

  const handleFileUpload = async (event, invoiceId) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('proofOfPayment', file);

      const token = localStorage.getItem('auth_token');
      
      console.log('Uploading file:', {
        invoiceId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });

      const response = await instance.post(
        `/payments/${invoiceId}/upload-proof`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Upload response:', response.data);

      if (response.data.success) {
        toast.success('Proof of payment uploaded successfully');
        await fetchInvoices();
      }
    } catch (err) {
      console.error('Upload error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          'Failed to upload proof of payment';
      toast.error(errorMessage);
    }
  };

  const handleStatusChange = async (invoiceId) => {
    try {
      setError(null);
      const token = localStorage.getItem('auth_token');
      
      // Send status update to backend
      const response = await instance.put(`/payments/${invoiceId}/status`, 
        { 
          status: 'paid',
          paid: true 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      // Refresh the invoices list after successful update
      if (response.data) {
        await fetchInvoices(); // Refresh the entire list to ensure consistency
      }
    } catch (err) {
      console.error('Payment status update failed:', err);
      setError(err.response?.data?.message || 'Failed to update payment status');
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    String(invoice.id).includes(searchTerm)
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6 md:ml-0 w-full">
        <div className="md:p-4">
          <h1 className="text-2xl font-bold mb-4">Billing & Payments</h1>
          <div className="flex justify-center mb-4">
            <button
              className={`px-4 py-2 ${activeTab === 'list' ? 'bg-black text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('list')}
            >
              Invoice List
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'add' ? 'bg-black text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('add')}
            >
              Add Invoice
            </button>
          </div>
          {activeTab === 'list' && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Invoice List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search invoices"
                      className="w-full mb-4 rounded-lg border-gray-200 shadow-sm focus:border-black focus:ring-black"
                    />
                    <table className="w-full text-sm">
                      <thead className="border-b">
                        <tr>
                          {[
                            { id: 'invoiceId', label: 'Invoice ID' },
                            { id: 'type', label: 'Type' },
                            { id: 'description', label: 'Description' },
                            { id: 'amount', label: 'Amount' },
                            { id: 'dueDate', label: 'Due Date' },
                            { id: 'status', label: 'Status' },
                            { id: 'studentName', label: 'Student Name' },
                            { id: 'studentId', label: 'Student ID' },
                            { id: 'proofOfPayment', label: 'Proof of Payment' },
                            { id: 'changeStatus', label: 'Change Status' }
                          ].map((header) => (
                            <th key={header.id} className="py-2 text-left">
                              {header.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInvoices.map((invoice) => (
                          <tr key={invoice._id} className="border-b last:border-b-0">
                            <td className="py-2">{invoice.invoiceId}</td>
                            <td className="py-2">{invoice.paymentType}</td>
                            <td className="py-2">{invoice.description}</td>
                            <td className="py-2">{formatCurrency(invoice.amount)}</td>
                            <td className="py-2">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice)}`}>
                                {getStatusText(invoice)}
                              </span>
                            </td>
                            <td className="py-2">
                              {invoice.paymentType === 'rent' ? invoice.studentName : 'N/A'}
                            </td>
                            <td className="py-2">
                              {invoice.paymentType === 'rent' ? invoice.studentId : 'N/A'}
                            </td>
                            <td className="py-2">
                              {invoice.proofOfPayment ? (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <a 
                                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${invoice.proofOfPayment}`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      window.open(
                                        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${invoice.proofOfPayment}`,
                                        '_blank',
                                        'noopener,noreferrer'
                                      );
                                    }}
                                  >
                                    View
                                  </a>
                                </div>
                              ) : (
                                <input
                                  type="file"
                                  onChange={(e) => handleFileUpload(e, invoice._id)}
                                  accept=".jpg,.jpeg,.png,.pdf"
                                  className="w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                />
                              )}
                            </td>
                            <td className="py-2">
                              <button
                                onClick={() => handleStatusChange(invoice._id)}
                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                key={`status-button-${invoice._id}`}
                              >
                                Change Status
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {activeTab === 'add' && (
            <div>
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
                      {Object.entries(INVOICE_TYPES).map(([key, value]) => (
                        <option key={key} value={value}>{key.charAt(0) + key.slice(1).toLowerCase()}</option>
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

                    {newInvoice.type === 'rent' && (
                      <>
                        <input
                          type="text"
                          value={newInvoice.studentName}
                          onChange={(e) => setNewInvoice({...newInvoice, studentName: e.target.value})}
                          placeholder="Enter student name"
                          className="w-full rounded-lg border-gray-200 shadow-sm focus:border-black focus:ring-black"
                        />

                        <input
                          type="email"
                          value={newInvoice.studentEmail}
                          onChange={(e) => setNewInvoice({...newInvoice, studentEmail: e.target.value})}
                          placeholder="Enter student email"
                          className="w-full rounded-lg border-gray-200 shadow-sm focus:border-black focus:ring-black"
                        />

                        <input
                          type="text"
                          value={newInvoice.studentId || ''}
                          onChange={(e) => setNewInvoice({...newInvoice, studentId: e.target.value})}
                          placeholder="Enter student ID"
                          className="w-full rounded-lg border-gray-200 shadow-sm focus:border-black focus:ring-black"
                        />
                      </>
                    )}

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
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingSystem;