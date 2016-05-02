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
  console.log("theid", req.params.id);
  console.log("to push", req.body.friends);
  User.findByIdAndUpdate(req.params.id, {$push: {friends: req.body.friends}} , { new: true }, function(err, user) {
      if(err) return res.status(500).json({message: err});
      console.log("match started", user)
    User.findByIdAndUpdate(req.body.friends, { $push: { friends: user._id }}, { new: true }, function(err, user2) {
        console.log("MATCH MADE", user2);
        if(err) return res.status(500).json({ message: err });
        return res.status(200).json({user: user, second: user2});
      });
  });
}

function deleteConnect(req,res) {
  console.log("theid", req.params.id);
  console.log("to push", req.body.friends);
  User.findByIdAndUpdate(req.params.id, {$pull: {friends: req.body.friends}} , { new: true }, function(err, user) {
      if(err) return res.status(500).json({message: err});
      User.findByIdAndUpdate(req.body.friends, { $pull: { friends: user._id }}, { new: true }, function(err, user2) {
        console.log(user, user2);
        if(err) return res.status(500).json({ message: err });
        return res.status(200).json({user: user, second: user2});
      });
  });
}


module.exports= {
  index: usersIndex,
  show: usersShow,
  connect: usersConnect,
  disconnect: deleteConnect
}