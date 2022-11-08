const express = require("express");
const router = express.Router();
const verifyToken = require('../Controllers/Verify.token')
const userController = require('../Controllers/User.controller')

//POST Request
router.post('/user/add', userController.addUser)
router.post('/user/login', userController.userLogin)

module.exports = router;