/**********************************************************
 * Miscellaneous functions used for utility tasks or checks
***********************************************************

/**
 * Checks if the string is in a valid JSON format
 * @param {String} str
 */
exports.isValidJson = function(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Checks if input is an array
 * @param {} arg
 */
exports.isArray = function(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}

/**
 * Gets the number of fields in an object
 * @param {{}} obj
 */
exports.getNumFields = function(obj) {
  return Object.keys(obj).length;
}