var User = require('../models/user');
var jwt  = require('jsonwebtoken');
var User = require('../models/user');
var secret = require('../config/app').secret;


function usersIndex(req, res) {
  User.find().populate('friends').exec(function(err, users) {
    if(err) return res.status(500).json({ message: err });
    console.log(users);
    return res.status(200).json(users);
  });
}


module.exports= {
  index: usersIndex
}