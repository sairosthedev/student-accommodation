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
  Wallet
} from 'lucide-react';

const PaymentSystem = () => {
  const [selectedPlan, setSelectedPlan] = useState('full');
  const [customAmount, setCustomAmount] = useState('');
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
      case 'completed': return 'green';
      case 'pending': return 'yellow';
      case 'upcoming': return 'blue';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="py-12 md:py-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Payment Center
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl">
              Manage your payments and view transaction history
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 -mt-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Payment</p>
                <p className="text-2xl font-bold text-gray-900">$1,500</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="text-2xl font-bold text-gray-900">Mar 15</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Payment</p>
                <p className="text-2xl font-bold text-gray-900">Feb 15</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Days Left</p>
                <p className="text-2xl font-bold text-gray-900">5 Days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Section */}
          <div className="space-y-8">
            {/* Make Payment */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Make Payment</h2>
                <p className="text-gray-600 mt-2">Choose your payment plan and proceed to payment</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  <div className="bg-purple-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Wallet className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Current Balance</h3>
                          <p className="text-sm text-gray-500">Due by March 15, 2024</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">$1,500.00</p>
                    </div>
                    <Progress value={70} size="sm" colorScheme="purple" className="rounded-full" />
                    <p className="text-sm text-gray-500 mt-2">5 days until due date</p>
                  </div>

                  <FormControl>
                    <FormLabel className="text-gray-700">Payment Plan</FormLabel>
                    <Select
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                      className="w-full rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    >
                      <option value="full">Full Payment ($1,500)</option>
                      <option value="installment">3-Month Installment ($500/month)</option>
                      <option value="custom">Custom Amount</option>
                    </Select>
                  </FormControl>

                  {selectedPlan === 'custom' && (
                    <FormControl>
                      <FormLabel className="text-gray-700">Custom Amount</FormLabel>
                      <NumberInput min={100}>
                        <NumberInputField
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="w-full rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </NumberInput>
                    </FormControl>
                  )}

                  <Button
                    onClick={handlePayment}
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
                <p className="text-gray-600 mt-2">Your saved payment methods</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">•••• 4242</p>
                        <p className="text-sm text-gray-500">Expires 12/24</p>
                      </div>
                    </div>
                    <Badge colorScheme="green">Default</Badge>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-dashed border-2 border-gray-300 hover:border-purple-500 text-gray-600 hover:text-purple-600"
                  >
                    + Add New Payment Method
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* History Section */}
          <div className="space-y-8">
            {/* Upcoming Payments */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Payments</h2>
                <p className="text-gray-600 mt-2">View and manage your upcoming payments</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`bg-${getStatusColor(payment.status)}-100 p-2 rounded-lg`}>
                          <Calendar className={`h-5 w-5 text-${getStatusColor(payment.status)}-600`} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{payment.type}</p>
                          <p className="text-sm text-gray-500">Due {payment.dueDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${payment.amount}</p>
                        <p className="text-sm text-gray-500">{payment.daysLeft} days left</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
                <p className="text-gray-600 mt-2">View your past transactions and download receipts</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{payment.type}</p>
                          <p className="text-sm text-gray-500">{payment.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${payment.amount}</p>
                          <p className="text-sm text-gray-500">{payment.receipt}</p>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSystem; 