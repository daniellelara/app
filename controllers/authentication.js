var User = require('../models/user');
var jwt  = require('jsonwebtoken');
var User = require('../models/user');

function register(req, res) {
  User.create(req.body, function(err, user) {
      // tidy up mongoose's awful error messages
      if(err) {
        console.log(err);
        if(err.code && (err.code === 11000 || err.code === 11001)) {
          var attribute = err.message.match(/\$?([a-z]+)_[0-9]/)[1];
          err = "An account with that " + attribute + " already exists";
        }
        return res.status(400).json({ message: err.toString() });
      }
      // var payload = { _id: user._id, username: user.username, email: user.email, role: user.role };
      // var token = jwt.sign(payload, secret, "24h");
      return res.status(200).json({ message: "Thanks for registering", user: user });
    });
}

 module.exports = {
  register: register
 }