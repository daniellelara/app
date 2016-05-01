var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/api');
var mongoose = require('mongoose');

afterEach(function(done) {
  mongoose.connect('mongodb://localhost/user-app', function(){
    mongoose.connection.db.dropDatabase(function(){
      done();
    }); 
  });
});

describe('POST /register', function() {
  it('should return a 400 response', function(done) {
    api.post('/register')
      .set('Accept', 'application/json')
      .send({
        password: "password",
        passwordConfirmation: "password",
        name: "Danielle"
      })
      .end(function(err, res) {
        expect(400);
        done();
      })
  });
  it('should create a user', function(done) {
    api.post('/register')
      .set('Accept', 'application/json')
      .send({
        username: "dangour",
        password: "password",
        passwordConfirmation: "password",
        email: "test@test.com",
        name: "Danielle"
      })
      .end(function(err, res) {
        expect(200);
        done();
      })
  });
  
  it('should generate a token on registration', function(done) {
    api.post('/register')
      .set('Accept', 'application/json')
      .send({
        username: "dangour",
        password: "password",
        passwordConfirmation: "password",
        email: "test@test.com",
        name: "Danielle"
      })
      .end(function(err, res) {
        console.log(res.body.token);
        expect(res.body.token).to.be.a('string');
        done();
      })
  });

});

describe('POST /login', function() {
  before(function(done) {
    api.post('/register')
      .set('Accept', 'application/json')
      .send({
        username: "dangour",
        password: "password",
        passwordConfirmation: "password",
        email: "test@test.com",
        name: "Danielle"
      })
      .end(function(err, res){
        done(err);
      });
  });
  it('should login', function(done) {
    api.post('/login')
      .set('Accept', 'application/json')
      .send({
        email: "test@test.com",
        password: "password"
      })
      .end(function(err, res) {
        console.log(res);
        expect(200);
        done();
      })
  });
});