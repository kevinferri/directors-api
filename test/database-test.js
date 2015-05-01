/****************************************
 * Tests for any db operation that is ran 
****************************************/

var mongoose = require('mongoose'),
  dbInfo = require('../config/database.js'),
  should = require('should'),
  utils = require('../lib/utils.js'),
  Director = require('../models/director.js');

beforeEach(function (done) {

 function clearDB() {
   for (var i in mongoose.connection.collections) {
     Director.remove({}, function(err, docs) {});
   }
   return done();
 }

 if (mongoose.connection.readyState === 0) {
   mongoose.connect(dbInfo['test'], function (err) {
     if (err) {
       throw err;
     }
     return clearDB();
   });
 } else {
   return clearDB();
 }
});

afterEach(function (done) {
 mongoose.disconnect();
 return done();
});

describe('Database', function() {

 describe('#create()', function () {
   it('should create a new Director', function (done) {
     var d = {
        livestream_id: 1,
        full_name: 'John Doe',
     };
     Director.create(d, function (err, director) {
       should.not.exist(err);
       director.livestream_id.should.equal(1);
       director.full_name.should.equal('John Doe');
       done();
     });
   });
 });

  describe('#save()', function() {
    it('should save without an error', function(done) {
      var director = new Director({ livestream_id: 1, full_name: 'Martin Scorsese'});
      director.save();
      done();
    });
  });

  /*describe('#find()', function() {
    it('should respond with matching records', function(done) {

      var d1 = new Director({ livestream_id: 1, full_name: 'Martin Scorsese'});
      var d2 = new Director({ livestream_id: 2, full_name: 'Mary Ann'});
      var d3 = new Director({ livestream_id: 3, full_name: 'John Doe'});

      d1.save();
      d2.save();
      d3.save();

      Director.find({ }, function(err, directors) {
        directors.length.should.equal(3);
        done();
      });
    });

  describe('#findOne()', function() {
    it('should only return one document', function(done) {

      var d1 = Director({ livestream_id: 1, full_name: 'Martin Scorsese'});
      d1.save();
      
      Director.findOne({ livestream_id: 1 }, function(err, director) {
        utils.isArray(director).should.equal(false);
        done();
      });
    });
  });

  describe('#findByIdAndRemove()', function() {
    it('should remove the document if it exists', function(done) {
      var director = new Director({ _id: 100, livestream_id: 1, full_name: 'Martin Scorsese'}),
        id = '53fbf4615c3b9f41c381b6a3';
      director.save();
      Director.findByIdAndRemove({ _id: id }, function(err, doc) {
        Director.findOne({ _id: id }, function (foundDirector) {
          foundDirector.should.equal(undefined);
          done();
        });
      });
    });
  });*/

});