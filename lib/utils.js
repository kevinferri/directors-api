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
 * @param {[]} arr
 */
exports.isArray = function(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}