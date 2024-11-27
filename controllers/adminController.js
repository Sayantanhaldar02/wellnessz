const AnalyticsService = require('../service/analyticsService');
const ClientModel = require('../models/client.model');
const UserModel = require('../models/user.model');

const analyticsService = new AnalyticsService(ClientModel, UserModel);

const getDashboard = async (req, res) => {
    try {
        const dashboardData = await analyticsService.getDashboardData();
        res.status(200).json({
            status: 200,
            data: dashboardData
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

module.exports = {
    getDashboard
};