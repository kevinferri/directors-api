exports.directorNotFound = function(id) {
  return {
    name: 'NotFoundError',
    message: 'There is no document with the id of ' + id
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

exports.notValidId = function(id) {
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