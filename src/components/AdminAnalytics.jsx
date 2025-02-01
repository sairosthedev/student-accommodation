import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Clock, Wrench } from 'lucide-react';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = React.useState({
    occupancyRate: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    maintenanceRequests: 0,
    monthlyData: [],
    roomTypeDistribution: {},
  });

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Simulated API call response for demo
      const response = {
        data: {
          occupancyRate: 85,
          totalRevenue: 150000,
          pendingPayments: 12500,
          maintenanceRequests: 8,
          monthlyData: [
            { month: 'Jan', revenue: 45000, newBookings: 32, occupancyRate: 82 },
            { month: 'Feb', revenue: 52000, newBookings: 38, occupancyRate: 85 },
            { month: 'Mar', revenue: 48000, newBookings: 35, occupancyRate: 88 }
          ],
          roomTypeDistribution: {
            'Single': 25,
            'Double': 40,
            'Suite': 20,
            'Deluxe': 15
          }
        }
      };

      setAnalytics(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const roomDistributionData = Object.entries(analytics.roomTypeDistribution).map(([type, value]) => ({
    type,
    value
  }));

  const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-4">
        <div className="bg-gray-100 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-gray-600" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">Analytics Dashboard</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Occupancy Rate"
            value={`${analytics.occupancyRate}%`}
            icon={TrendingUp}
          />
          <StatCard 
            title="Total Revenue"
            value={`$${analytics.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
          />
          <StatCard 
            title="Pending Payments"
            value={`$${analytics.pendingPayments.toLocaleString()}`}
            icon={Clock}
          />
          <StatCard 
            title="Maintenance Requests"
            value={analytics.maintenanceRequests}
            icon={Wrench}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {analytics.monthlyData.length > 0 && (
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Revenue Trends</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ background: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#000000" 
                        strokeWidth={2}
                        dot={{ fill: '#000000', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          
          {Object.keys(analytics.roomTypeDistribution).length > 0 && (
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Room Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roomDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="type" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ background: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="value" fill="#000000" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>

        {analytics.monthlyData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">Monthly Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Month</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Revenue</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">New Bookings</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Occupancy Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analytics.monthlyData.map((data, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">{data.month}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${data.revenue.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{data.newBookings}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{data.occupancyRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {analytics.monthlyData.length === 0 && !error && (
          <div className="bg-gray-50 text-center py-12 rounded-xl">
            <div className="text-gray-500 text-lg">No analytics data available</div>
            <p className="text-gray-400 mt-2">Data will appear here once it's available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;