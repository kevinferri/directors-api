var errors = require('./errors.js');

exports.isValidId = function(id) {
  return !isNaN(id) && id > 0;
}