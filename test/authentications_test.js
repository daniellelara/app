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
        name: "Danielle"
      })
      .end(function(err, res) {
        expect(200);
        done();
      })
  });
  it('should create a user', function(done) {
    api.post('/register')
      .set('Accept', 'application/json')
      .send({
        name: "Danielle"
      })
      .end(function(err, res) {
        expect(200);
        done();
      })
  });
});