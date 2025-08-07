const express = require('express')
const router = express.Router()
const dashBoardController = require('../controllers/App/DashboardController')
const authMiddleware = require("../middlewares/authMiddleware");

router.post('/getData', authMiddleware, dashBoardController.getData);

module.exports = router 