const express = require('express')
const router = express.Router()
const authController = require('../controllers/Auth/AuthController')

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/verify', authController.verify);
router.post('/replyVerify', authController.replyVerCode);

module.exports = router 