const UserModel = require('../models/user.model');
const CoachService = require('../service/coachService');
const coachService = new CoachService(UserModel);

const createCoach = async (req, res) => {
    try {
        const response = await coachService.createCoach(req);
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

const getAllCoaches = async (req, res) => {
    try {
        const response = await coachService.getAllCoaches();
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

const getClientsByCoachId = async (req, res) => {
    try {
        const response = await coachService.getClientsByCoachId(req);
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

module.exports = {
    createCoach,
    getAllCoaches,
    getClientsByCoachId
};
