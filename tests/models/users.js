var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var projectroot = require('project-root-path')

var connection = require(projectroot + '/utils/mongoose');
var User;

before(function(done) {
  connection(done);
});

describe('User', function () {

  beforeEach(function(done){
    User = require(projectroot + '/routes/api/services/users');
    done();
  })

  describe('Saving Data', function () {
    
    it('should save a valid user', function (done) {
      var userobject = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        institute: "John Doe Institute",
        googleID: "12345678",
      }
      var item = new User.model(userobject);
      item.save(function(err, data){
        if (err) return done(err);
        assert.equal(data.email, userobject.email);
        done();
      })
    });

    it('should not save a user without email', function (done) {
      var userobject = {
        name: "Jane Doe",
        institute: "Jane Doe Institute",
        googleID: "12345678",
      }
      var item = new User.model(userobject);
      item.save(function(err, data){
        if (err) return done();
        done(new Error('Saved successfully.'));
      });
    });

    it('should not save a user with same email', function (done) {
      var userobject = {
        name: "Janice Doe",
        email: "john.doe@gmail.com"
      }
      var item = new User.model(userobject);
      item.save(function(err, data){
        if (err) return done();
        done(new Error('Saved successfully.'));
      });
    });

  });
});