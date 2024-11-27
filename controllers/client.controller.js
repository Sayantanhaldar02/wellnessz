const ClientModel = require('../models/client.model');
const ClientService = require('../service/clientService');
const clientService = new ClientService(ClientModel);

const createClient = async (req, res) => {
    try {
        const response = await clientService.createClient(req);
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

const getAllClients = async (req, res) => {
    try {
        const response = await clientService.getAllClients();
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

const updateClientDetails = async (req, res) => {
    try {
        const response = await clientService.updateClientDetails(req);
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

const deleteClient = async (req, res) => {
    try {
        const response = await clientService.deleteClient(req);
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};


const scheduleFollowUp = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await clientService.scheduleFollowUp(id, req.body);
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};




module.exports = {
    createClient,
    getAllClients,
    updateClientDetails,
    deleteClient,
    scheduleFollowUp
};
