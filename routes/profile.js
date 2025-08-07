const express = require("express");
const router = express.Router();
const ProfileController = require("../controllers/App/ProfileController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/getData", authMiddleware, ProfileController.getData);
router.post("/updateProfile", authMiddleware, ProfileController.updateProfile);
router.post("/updatePassword", authMiddleware, ProfileController.updatePassword);

module.exports = router;
