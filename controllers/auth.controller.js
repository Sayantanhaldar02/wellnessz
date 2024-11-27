const UserModel = require("../models/user.model");
const AuthService = require("../service/authService");
const authService = new AuthService(UserModel);

const registerUser = async (req, res) => {
    try {
        const response = await authService.RegisterUser(req);
        res.status(response.status).json(response);
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 500, message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const response = await authService.LoginUser(req);
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const response = await authService.getAllUsers();
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
};