const router = require("express").Router();
const { createClient, getAllClients, updateClientDetails, deleteClient, scheduleFollowUp } = require("../controllers/client.controller");
const { authenticateTo } = require("../middleware/auth.middleware");

router.post("/clients", authenticateTo(["admin", "coach"]), createClient);
router.get("/clients", authenticateTo(["admin", "coach"]), getAllClients);
router.patch("/clients/:id/progress",authenticateTo(["coach"]), updateClientDetails);
router.delete("/clients/:id", authenticateTo(["admin"]), deleteClient);
router.post("/clients/:id/schedule", authenticateTo(["admin", "coach"]), scheduleFollowUp);


module.exports = {
    clientRouter: router
};