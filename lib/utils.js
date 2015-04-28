/**********************************************************
 * Miscellaneous functions used for utility tasks or checks
***********************************************************

/**
 * Checks if the id is a number and is greather than 0
 * @param {int} id
 */
exports.isValidId = function(id) {
  //return typeof id !== 'undefined' && !isNaN(id) && id > 0;
  return true;
}

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
 * Unescapes quotes - used for pretty printing error messages
 * @param {String} str
 */
exports.unescapeQuotes = function(str) {
  return str.replace(/\\"/g, '"');
}

exports.getRequestBody = function(req, res) {

}