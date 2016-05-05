var mongoose = require('mongoose');
var User = require('../models/user');


mongoose.connect('mongodb://localhost/user-app');
User.collection.drop();

User.create([{
  username: "amalia",
  email: "amalia@gmail.com",
  password:'password',
  passwordConfirmation: "password",
  role: 'admin'
},{
  username: "danielle",
  email: "danielle@gmail.com",
  password:'password',
  passwordConfirmation: "password",
  role: 'super'

},{
  username: "alex",
  email: "alex@gmail.com",
  password:'password',
  passwordConfirmation: "password"
}], function(err, users){
    if(err) console.error(err);
    console.log(users);
    mongoose.connection.close();
  });
