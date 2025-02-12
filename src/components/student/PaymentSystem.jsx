import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Button,
  useToast,
  Select,
  NumberInput,
  NumberInputField,
  Progress,
  Badge,
} from '@chakra-ui/react';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Download,
  Wallet,
  Search,
  Filter,
  Plus,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PaymentPDF from './PaymentPDF';

const PaymentSystem = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const paymentHistory = [
    {
      id: 1,
      date: '2024-02-15',
      amount: 1500,
      status: 'completed',
      type: 'Room Rent',
      receipt: '#INV-2024-001'
    },
    {
      id: 2,
      date: '2024-01-15',
      amount: 1500,
      status: 'completed',
      type: 'Room Rent',
      receipt: '#INV-2024-002'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Payment Details</h1>
            <p className="text-sm text-gray-600 mt-1">View and download your payment history</p>
          </div>
          <PDFDownloadLink 
            document={<PaymentPDF payments={paymentHistory} />}
            fileName="payment_history.pdf"
          >
            {({ loading }) => (
              <button className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900">
                {loading ? 'Generating PDF...' : 'Download Payment History'}
              </button>
            )}
          </PDFDownloadLink>
        </div>

        {/* Payment History Table */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 flex-col sm:flex-row">
                <div className="relative flex-1 w-full max-w-md">
                  <input
                    type="text"
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-black focus:ring-black"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <button className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <Filter className="h-5 w-5 text-gray-600 mr-2" />
                  <span>Filter</span>
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
                {['all', 'paid', 'pending', 'overdue'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg capitalize transition-all whitespace-nowrap ${
                      filterStatus === status
                        ? 'bg-black text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:grid grid-cols-7 gap-4 p-4 bg-gray-50 text-sm font-medium text-gray-600">
            <div className="col-span-2">Payment</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Date</div>
            <div>Receipt</div>
            <div>Actions</div>
          </div>

          <div className="divide-y divide-gray-100">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 hover:bg-gray-50 transition-colors items-center">
                <div className="col-span-2 flex justify-between items-start md:block">
                  <div>
                    <h3 className="font-medium text-gray-900">{payment.type}</h3>
                    <p className="text-sm text-gray-500">#{payment.id}</p>
                  </div>
                  <div className="md:hidden">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900 flex justify-between items-center md:block">
                  <span className="md:hidden">Amount:</span>
                  ${payment.amount}
                </div>
                <div className="hidden md:block">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 flex justify-between items-center md:block">
                  <span className="md:hidden">Date:</span>
                  {payment.date}
                </div>
                <div className="text-sm text-gray-600 flex justify-between items-center md:block">
                  <span className="md:hidden">Receipt:</span>
                  {payment.receipt}
                </div>
                <div className="flex justify-end md:block">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSystem; 