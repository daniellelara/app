var router = require('express').Router();
var jwt = require('jsonwebtoken');
var authenticationController = require('../controllers/authentication');


router.post('/register', authenticationController.register);
router.post('/login', authenticationController.login);

module.exports = router; 