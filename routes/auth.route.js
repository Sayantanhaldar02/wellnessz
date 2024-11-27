const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getAllUsers } = require("../controllers/auth.controller");
const { authenticateTo } = require("../middleware/auth.middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", authenticateTo(["admin"]), getAllUsers);


module.exports = {
    authRouter: router
};
