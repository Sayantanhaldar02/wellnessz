const NodeCache = require('node-cache');
const cache = new NodeCache();
const CACHE_KEY = 'dashboardData';
const CACHE_TTL = 300; // 5 minutes in seconds

class AnalyticsService {
    constructor(clientModel, userModel) {
        this.clientModel = clientModel;
        this.userModel = userModel;
    }

    async getDashboardData() {
        // Check cache first
        const cachedData = cache.get(CACHE_KEY);
        if (cachedData) {
            return cachedData;
        }

        // Calculate dashboard metrics
        const [
            totalClients,
            activeClients,
            coachStats,
            progressTrends
        ] = await Promise.all([
            this.getTotalClients(),
            this.getActiveClients(),
            this.getCoachStats(),
            this.getProgressTrends()
        ]);

        const dashboardData = {
            totalClients,
            activeClients,
            coachStats,
            progressTrends,
            lastUpdated: new Date()
        };

        // Cache the data
        cache.set(CACHE_KEY, dashboardData, CACHE_TTL);

        return dashboardData;
    }

    async getTotalClients() {
        return await this.clientModel.countDocuments();
    }

    async getActiveClients() {
        const now = new Date();
        return await this.clientModel.countDocuments({
            'sessions.date': { $gt: now },
            'sessions.status': 'scheduled'
        });
    }

    async getCoachStats() {
        const coaches = await this.userModel.countDocuments({ role: 'coach' });
        const totalClients = await this.clientModel.countDocuments();
        
        return {
            totalCoaches: coaches,
            averageClientsPerCoach: coaches ? (totalClients / coaches).toFixed(2) : 0
        };
    }

    async getProgressTrends() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const clients = await this.clientModel.find({
            lastUpdated: { $gte: thirtyDaysAgo }
        }).select('weight progress lastUpdated');

        // Calculate weight trends
        const weightTrends = clients.reduce((acc, client) => {
            if (client.weight) {
                const week = new Date(client.lastUpdated).toISOString().slice(0, 10);
                if (!acc[week]) {
                    acc[week] = { total: 0, count: 0 };
                }
                acc[week].total += client.weight;
                acc[week].count++;
            }
            return acc;
        }, {});

        // Calculate averages
        return Object.entries(weightTrends).map(([date, data]) => ({
            date,
            averageWeight: (data.total / data.count).toFixed(2)
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
    }
}

module.exports = AnalyticsService;