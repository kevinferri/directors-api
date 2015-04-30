/****************************************
 * Tests for any db operation that is ran 
*****************************************/

/*var should = require('should'),
  utils = require('../lib/utils.js');

describe('Database', function() {

  var Director = require('../models/Director.js');

  describe('save()', function() {
    it('should save without an error', function(done) {
      var director = new Director({ livestream_id: 1, full_name: 'Martin Scorsese'});
      director.save();
      done();
    });
  });

  describe('find()', function() {
    it('should respond with matching records', function(done) {

      var d1 = new Director({ livestream_id: 1, full_name: 'Martin Scorsese'});
      var d2 = new Director({ livestream_id: 1, full_name: 'John Doe'});
      var d3 = new Director({ livestream_id: 1, full_name: 'Mary Ann'});

      d1.save();
      d2.save();
      d3.save();

      Director.find({}, function(err, directors) {
        directors.should.have.length(3);
        done();
      });
    });
  });

  describe('findOne()', function() {
    it('should only return one document', function(done) {

      new Director({ livestream_id: 1, full_name: 'Martin Scorsese'}).save();
      new Director({ livestream_id: 2, full_name: 'John Doe'}).save();
      new Director({ livestream_id: 3, full_name: 'Mary Ann'}).save();
      
      Director.findOne({ livestream_id: 1 }, function(err, director) {
        utils.isArray(director).should.equal(false) && should.exist(director);
        done();
      });
    });
  });

  describe('findByIdAndRemove()', function() {
    it('should remove the document if it exists', function(done) {
      var director = new Director({ _id: 100, livestream_id: 1, full_name: 'Martin Scorsese'}),
        id = '53fbf4615c3b9f41c381b6a3';
      director.save();
      Director.findByIdAndRemove({ _id: id }, function(err, doc) {
        Director.findOne({ _id: id }, function (foundDirector) {
          foundDirector.should.equal(null);
          done();
        });
      });
    });
  });

})*/