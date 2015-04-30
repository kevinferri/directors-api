/****************************************
 * Tests for any db operation that is ran 
*****************************************/

var should = require('should');

describe('Database', function(){

  var Director = require('../models/Director.js');

  describe('save()', function() {
    it('should save without an error', function(done) {
      var director = new Director({ livestream_id: 1, full_name: 'Martin Scorsese'});
      director.save();
      done();
    });
  });

  describe('find()', function() {
    it('should respond with matching records', function() {
      var d = new Director({ livestream_id: 1, full_name: 'Martin Scorsese'});
      d.save();
      new Director({ livestream_id: 2, full_name: 'John Doe'}).save();
      new Director({ livestream_id: 3, full_name: 'Mary Ann'}).save();

      Director.find({}, function(err, directors) {
        directors.length.should.equal(3);
        done();
      });
    });
  });

  describe('findOne()', function() {
    it('should only return one document', function(done) {

      new Director({ livestream_id: 1, full_name: 'Martin Scorsese'}).save();
      new Director({ livestream_id: 2, full_name: 'John Doe'}).save();
      new Director({ livestream_id: 3, full_name: 'Mary Ann'}).save();

      Director.findOne({ livestream_id: 1 }, function(director) {
        
      });
    });
  });

})