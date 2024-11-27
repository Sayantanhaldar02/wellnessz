require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


class AuthService {
    constructor(userModel) {
        this.userModel = userModel;
    }


    async RegisterUser(req) {
        const {
            name,
            email,
            password,
            role,
            specialization
        } = req.body;
        // console.log(req.body)
        const user = await this.userModel.findOne({ email: email });
        // console.log(user)
        if (user) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new this.userModel({
            name,
            email,
            password: hashedPassword,
            role,
            specialization
        });
        // console.log(newUser)
        await newUser.save();
        return {
            status: 201,
            user: newUser,
            message: "User registered successfully"
        }
    }


    async LoginUser(req) {
        const {
            email,
            password
        } = req.body;

        const user = await this.userModel.findOne({ email: email });
        if (!user) {
            throw new Error("User not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }
        const token = jwt.sign({
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            specialization: user.specialization
        }, process.env.JWT_SECRET);
        return {
            status: 200,
            token,
            message: "User logged in successfully"
        }
    }

    async getAllUsers() {
        const users = await this.userModel.find();
        return {
            status: 200,
            users,
            message: "Users fetched successfully"
        }
    }
}

module.exports = AuthService