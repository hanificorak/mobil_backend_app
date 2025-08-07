const express = require("express");
const router = express.Router();
const SettingsController = require("../controllers/App/SettingsController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/save", authMiddleware,SettingsController.save);
router.post("/getData", authMiddleware,SettingsController.getData);

module.exports = router;
