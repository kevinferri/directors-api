var Director = require('../models/Director.js'),
  errors = require('../lib/errors.js'),
  utils = require('../lib/utils.js');

/**
 * Inserts a new director document into the database
 * @param {{}} obj
 */
exports.insertDirector = function(obj) {
  var director = new Director({
    _id: obj._id,
    full_name: obj.full_name,
    dob: obj.dob,
  });

  director.save(function(err) {
    if (err) {
      throw err;
    }
  });
}

/**
 * Finds an individual director document from the database and passes it into a callback 
 * @param {int} id
 * @param {function} callback
 */
exports.findDirectorById = function(id, callback) {
  if (utils.isValidId(id)) {
    Director.findOne({ '_id': id }, function(err, director) {
      if (err) {
        throw err;
      }
      if (director) {
        callback(director);
      } else {
        callback(errors.directorNotFound(id));
      }
    }); 
  } else {
    callback(errors.notValidId(id));
  }
}

/**
 * Finds all director documents from the database and passes it into a callback 
 * @param {int} id
 * @param {function} callback
 */
exports.findAllDirectors = function(callback) {
  Director.find(function(err, directors) {
    if (err) {
      throw err;
    }
    callback(directors);
  }); 
}

exports.updateDirector = function(id, callback) {
  
}