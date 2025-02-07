const Room = require('../models/Room');
const Application = require('../models/Application');
const Maintenance = require('../models/Maintenance');
const Student = require('../models/Student');

// Get all analytics data
const getAnalytics = async (req, res) => {
    try {
        // Get total rooms and occupied rooms for occupancy rate
        const totalRooms = await Room.countDocuments();
        const occupiedRooms = await Room.countDocuments({ status: 'occupied' });
        const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

        // Get total revenue and pending payments from applications
        const applications = await Application.find({ status: 'approved' });
        const totalRevenue = applications.reduce((sum, app) => sum + (app.paymentStatus === 'paid' ? app.amount : 0), 0);
        const pendingPayments = applications.reduce((sum, app) => sum + (app.paymentStatus === 'pending' ? app.amount : 0), 0);

        // Get maintenance requests count
        const maintenanceRequests = await Maintenance.countDocuments({ status: 'pending' });

        // Get monthly data for the last 3 months
        const monthlyData = await getMonthlyData();

        // Get room type distribution
        const rooms = await Room.find();
        const roomTypeDistribution = rooms.reduce((acc, room) => {
            acc[room.type] = (acc[room.type] || 0) + 1;
            return acc;
        }, {});

        res.json({
            occupancyRate,
            totalRevenue,
            pendingPayments,
            maintenanceRequests,
            monthlyData,
            roomTypeDistribution
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: 'Error fetching analytics data' });
    }
};

// Helper function to get monthly data
const getMonthlyData = async () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const monthlyData = [];

    for (let i = 2; i >= 0; i--) {
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

        // Get monthly revenue
        const monthlyApplications = await Application.find({
            createdAt: {
                $gte: targetDate,
                $lte: endDate
            },
            status: 'approved',
            paymentStatus: 'paid'
        });

        const revenue = monthlyApplications.reduce((sum, app) => sum + app.amount, 0);

        // Get new bookings count
        const newBookings = await Application.countDocuments({
            createdAt: {
                $gte: targetDate,
                $lte: endDate
            },
            status: 'approved'
        });

        // Calculate occupancy rate for that month
        const occupiedRoomsCount = await Room.countDocuments({
            status: 'occupied',
            lastStatusUpdate: {
                $lte: endDate
            }
        });
        const totalRooms = await Room.countDocuments();
        const monthlyOccupancyRate = totalRooms > 0 ? Math.round((occupiedRoomsCount / totalRooms) * 100) : 0;

        monthlyData.push({
            month: months[targetDate.getMonth()],
            revenue,
            newBookings,
            occupancyRate: monthlyOccupancyRate
        });
    }

    return monthlyData;
};

module.exports = {
    getAnalytics
}; 