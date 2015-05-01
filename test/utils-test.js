/*********************************************
 * Tests for any utility operation that is run 
**********************************************/

var should = require('should'),
  utils = require('../lib/utils.js');

describe('Utils', function() {

  describe('#isValidJson()', function() {
    it('should return true only if input is valid JSON', function(done) {
      utils.isValidJson('{ "test": ""{').should.equal(false);
      utils.isValidJson('{ "foo": "bar" }').should.equal(true);
      done();
    });
  });

  describe('#isArray()', function() {
    it('should return true only if the input is an array', function(done) {
      utils.isArray([1, 2, 3]).should.equal(true);
      utils.isArray('string').should.equal(false);
      done();
    });
  });

});