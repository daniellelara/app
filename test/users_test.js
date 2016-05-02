var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/api');
var mongoose = require('mongoose');
var User = require('../models/user');


afterEach(function(done) {
  mongoose.connect('mongodb://localhost/user-app', function(){
    User.create({ username: "lara", email: "y@gmail.com", password: "password",passwordConfirmation: "password" }, function(err, user){
        userId = user._id.toString();
        done(err);
    }); 
  });
});

describe('GET /users', function() {
  before(function(done) {
    api.post('/register')
      .set('Accept', 'application/json')
      .send({ username: "danielle", email: "danielle@gmail.com", password: "password", passwordConfirmation: "password" })
      .end(function(err, res){
        done(err);
      });
  });
  it('should return a 200 response', function(done) {
    api.get('/users')
      .set('Accept', 'application/json')
      .expect(200, done);
  });
  it('should return an array', function(done) {
    api.get('/users')
      .set('Accept', 'application/json')
      .end(function(err, res) {
        console.log(res.body);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});  

describe('GET /users/:id', function() {
  it('should return a 200 response', function(done) {
    api.get('/users/' + userId)
      .set('Accept', 'application/json')
      .expect(200, done);
  });
})