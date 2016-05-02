var User = require('../models/user');
var jwt  = require('jsonwebtoken');
var User = require('../models/user');
var secret = require('../config/app').secret;

//get all users
function usersIndex(req, res) {
  User.find().populate('friends').exec(function(err, users) {
    if(err) return res.status(500).json({ message: err });
    console.log(users);
    return res.status(200).json(users);
  });
}

//show a user and show its connections
function usersShow(req, res) {
  User.findById(req.params.id).populate('friends').exec(function(err, user) {
    console.log(user);
    if(err) return res.status(500).json({ message: err });
    if(!user) return res.status(404).send();
    return res.status(200).json(user);
  });
}

function usersConnect(req,res) {
  User.findByIdAndUpdate(req.params.id, { $push:{ friends: req.body.friends }}, { new: true }, function(err, user) {
    console.log(user);
    if(err) return res.status(500).json({message: err});
    return res.status(200).json(user);
  });
}


module.exports= {
  index: usersIndex,
  show: usersShow,
  connect: usersConnect
}