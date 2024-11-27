const router = require("express").Router();
const { getDashboard } = require("../controllers/adminController");
const { authenticateTo } = require("../middleware/auth.middleware");

router.get("/admin/dashboard", authenticateTo(["admin"]), getDashboard);

module.exports = {
    adminRouter: router
};