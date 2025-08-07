const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/App/AppointmentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/getData", authMiddleware, appointmentController.getData);
router.post("/getParam", authMiddleware, appointmentController.getParam);
router.post("/save", authMiddleware, appointmentController.save);
router.post("/delete", authMiddleware, appointmentController.delete);
router.post("/addCategory", authMiddleware, appointmentController.addCategory);

module.exports = router;
