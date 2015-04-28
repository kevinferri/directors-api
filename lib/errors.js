/******************************************************
 * Defines all the error messages needed for the API
 * Each returns an object that can be sent as response
******************************************************/

exports.noLivestreamAccount = function(id) {
  return {
    name: 'NoLivestreamAccount',
    message: 'There is no Livestream director with the id of ' + id
  }
}

exports.badRequestBody = function(body) {
  return {
    name: 'BadRequestBody',
    message: 'Bad Request body: ' + body
  }
}

exports.invalidId = function(id) {
  return {
    name: 'InvalidId',
    message: id + ' is not a valid ID'
  }
}

exports.tooMuchData = function() {
  return {
    name: 'TooMuchData',
    message: 'Too much POST data'
  }
}

exports.alreadyRegistered = function(id) {
  return {
    name: 'AlreadyRegistered',
    message: 'The director with id ' + id + ' is already registered'
  }
}

exports.invalidJson = function(str) {
  return {
    name: 'InvalidJson',
    message: str + ' is not valid JSON',
  }
}