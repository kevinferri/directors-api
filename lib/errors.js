/******************************************************
 * Defines all the error messages needed for the API
 * Each returns an object that can be sent as response
******************************************************/

exports.invalidId = function(id) {
  return {
    name: 'InvalidId',
    message: id + ' is not a valid ID'
  }
}