require("dotenv").config();
const jwt = require("jsonwebtoken");

function generateValue(token) {
    if (!token) return null;

    return jwt.verify(token, process.env.JWT_SECRET);
}


const checkAuthentication = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return next()
    }
    token = authHeader.split(' ')[1];
    const user_value = generateValue(token)
    req.user = user_value
    // console.log(user_value)
    return next();
}

const authenticateTo = (roles = []) => {
    return (req, res, next) => {
        // console.log(req.user)
        if (!req.user) return res.status(401).json({
            message: "user not authenticate!"
        })
        if (!roles.includes(req.user.role)) return res.status(403).json({
            message: "user not authorized to access this resource!"
        })
        return next();
    }
}

module.exports = {
    checkAuthentication,
    authenticateTo
};