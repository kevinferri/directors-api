/*********************************************
 * Tests for interacting with Livestream's API
*********************************************/

describe('Livestream API', function() {

  var should = require('should'),
    livestreamAPI = require('../lib/Livestream-api.js'),
    utils = require('../lib/utils.js');

  describe('getLivestreamDirector()', function() {
    
    it('should get the Livestream director with the id that is passed as a parameter', function(done) {
      livestreamAPI.getLivestreamDirector(92383, function(director) {
        director._id.should.equal(92383);
        done();
      });
    });

    it ('should return a director with exactly 3 fields: _id, full_name, and dob', function(done) {
      livestreamAPI.getLivestreamDirector(92383, function(director) {
        utils.getNumFields(director).should.equal(3) &&
        (typeof director._id).should.equal('number') &&
        (typeof director.full_name).should.equal('string') &&
        (typeof director.dob).should.equal('string') &&
        done();
      });
    });

  });

});