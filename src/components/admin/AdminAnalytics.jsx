import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Clock, Wrench } from 'lucide-react';
import axios from '../../services/api';

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
      const response = await axios.get('/analytics');
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
    type: type.replace(/([A-Z])/g, ' $1').trim(),
    value,
    percentage: ((value / Object.values(analytics.roomTypeDistribution).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
  }));

  const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="bg-gray-100 p-2 sm:p-3 rounded-lg">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-600">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8 text-gray-900">Analytics Dashboard</h2>
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8 text-gray-900">Analytics Dashboard</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-8">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
          {analytics.monthlyData.length > 0 ? (
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">Revenue Trends</h3>
                <div className="h-60 sm:h-80">
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-indigo-600"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
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
                  )}
                </div>
              </div>
            </div>
          ) : null}
          
          {Object.keys(analytics.roomTypeDistribution).length > 0 ? (
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">Room Type Distribution</h3>
                <div className="h-60 sm:h-80">
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-indigo-600"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={roomDistributionData} margin={{ top: 5, right: 5, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="type" 
                          stroke="#64748b" 
                          tick={{ fontSize: 11 }}
                          angle={-45}
                          textAnchor="end"
                          interval={0}
                        />
                        <YAxis 
                          stroke="#64748b" 
                          tick={{ fontSize: 12 }}
                          label={{ value: 'Number of Rooms', angle: -90, position: 'insideLeft', offset: 10 }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            background: '#fff', 
                            border: 'none', 
                            borderRadius: '8px', 
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            padding: '8px 12px'
                          }}
                          formatter={(value, name, props) => [
                            `${value} rooms (${props.payload.percentage}%)`,
                            'Count'
                          ]}
                          labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                        />
                        <Bar 
                          dataKey="value" 
                          fill="#000000" 
                          radius={[4, 4, 0, 0]}
                          label={{ 
                            position: 'top', 
                            content: (props) => `${props.value}`,
                            fontSize: 11
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {analytics.monthlyData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-gray-100">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Monthly Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600">Month</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600">Revenue</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600">New Bookings</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600">Occupancy Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analytics.monthlyData.map((data, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">{data.month}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">${data.revenue.toLocaleString()}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">{data.newBookings}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">{data.occupancyRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {analytics.monthlyData.length === 0 && !error && (
          <div className="bg-gray-50 text-center py-8 sm:py-12 rounded-xl">
            <div className="text-base sm:text-lg text-gray-500">No analytics data available</div>
            <p className="text-sm sm:text-base text-gray-400 mt-2">Data will appear here once it's available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;