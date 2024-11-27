const router = require("express").Router();
const { createCoach, getAllCoaches, getClientsByCoachId } = require("../controllers/coach.controller");
const { authenticateTo } = require("../middleware/auth.middleware");

router.post("/coaches", authenticateTo(["admin"]), createCoach);
router.get("/coaches", authenticateTo(["admin"]), getAllCoaches);
router.get("/coaches/:coachId/clients", authenticateTo(["admin", "coach"]), getClientsByCoachId);


module.exports = {
    coachRouter: router
};