/******************************************************
 * Defines all the error messages needed for the API
 * Each returns an object that can be sent as response
******************************************************/

exports.directorNotFound = function(id) {
  return {
    name: 'NotFoundError',
    message: 'There is no registered director with the id of ' + id
  }
}

exports.noLivestreamAccount = function(id) {
  return {
    name: 'NoLivestreamAccountError',
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
    name: 'NotValidId',
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
    name: 'NotValidJson',
    message: str + ' is not valid JSON',
  }
}