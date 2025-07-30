const express = require('express')
const router = express.Router()
const ParamController = require('../controllers/App/ParamController')

router.post('/getCities', ParamController.getCities);

module.exports = router 