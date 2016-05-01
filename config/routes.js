var router = require('express').Router();
var jwt = require('jsonwebtoken');
var authenticationController = require('../controllers/authentication');


router.post('/register', authenticationController.register);

module.exports = router; 