const express = require('express');
const usersController = require('../controllers/usersControllers')
const router = express.Router();

router.post('/user-register',usersController.userRegister)

module.exports = router;