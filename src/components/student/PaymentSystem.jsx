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

const PaymentSystem = () => {
  const [selectedPlan, setSelectedPlan] = useState('full');
  const [customAmount, setCustomAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

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

  const upcomingPayments = [
    {
      id: 1,
      dueDate: '2024-03-15',
      amount: 1500,
      type: 'Room Rent',
      status: 'pending',
      daysLeft: 5
    },
    {
      id: 2,
      dueDate: '2024-04-15',
      amount: 1500,
      type: 'Room Rent',
      status: 'upcoming',
      daysLeft: 35
    }
  ];

  const recentPayments = [
    {
      id: 1,
      type: 'Rent',
      amount: 1200,
      status: 'paid',
      dueDate: '2024-03-15',
      paidDate: '2024-03-14',
      method: 'Credit Card'
    },
    {
      id: 2,
      type: 'Utilities',
      amount: 150,
      status: 'pending',
      dueDate: '2024-03-20',
      paidDate: null,
      method: null
    },
    {
      id: 3,
      type: 'Maintenance',
      amount: 75,
      status: 'overdue',
      dueDate: '2024-03-10',
      paidDate: null,
      method: null
    }
  ];

  const handlePayment = async () => {
    try {
      // TODO: Integrate with payment gateway API
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: customAmount || 1500,
          paymentPlan: selectedPlan,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Payment Successful!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'gray';
      case 'pending': return 'gray';
      case 'upcoming': return 'gray';
      case 'overdue': return 'gray';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Payments</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your payments and billing history</p>
          </div>
          <button
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span>Make Payment</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Due</p>
                <p className="text-2xl font-bold text-gray-900">$1,425</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-gray-900">$1,200</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">$150</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">$75</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Toolbar */}
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

          {/* Table Header */}
          <div className="hidden md:grid grid-cols-7 gap-4 p-4 bg-gray-50 text-sm font-medium text-gray-600">
            <div className="col-span-2">Payment</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Due Date</div>
            <div>Method</div>
            <div>Actions</div>
          </div>

          {/* Table Content */}
          <div className="divide-y divide-gray-100">
            {recentPayments.map((payment) => (
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
                  <span className="md:hidden">Due Date:</span>
                  {payment.dueDate}
                </div>
                <div className="text-sm text-gray-600 flex justify-between items-center md:block">
                  <span className="md:hidden">Method:</span>
                  {payment.method || '-'}
                </div>
                <div className="flex justify-end md:block">
                  {payment.status !== 'paid' ? (
                    <button className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 text-sm">
                      Pay Now
                    </button>
                  ) : (
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="h-5 w-5 text-gray-400" />
                    </button>
                  )}
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