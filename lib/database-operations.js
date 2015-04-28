/**************************************************************************************************************************
 * Handles database operations
 * Each function assumes data is sanitized and validated - the controller is responsible for sanitizing/validating the data
***************************************************************************************************************************/

var Director = require('../models/Director.js'),
  errors = require('../lib/errors.js'),
  utils = require('../lib/utils.js');

/**
 * Inserts a new director document into the database
 * @param {{}} obj
 */
exports.insertDirector = function(obj, callback) {
  var director = new Director({
    _id: obj._id,
    full_name: obj.full_name,
    dob: obj.dob,
  });

  director.save(function(err) {
    if (err) {
      throw err;
    }
    callback(director);
  });
}

/**
 * Finds an individual director document from the database and passes it into a callback 
 * @param {int} id
 * @param {function} callback
 */
exports.findDirectorById = function(id, callback) {
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

/**
 * Updates a single director document with specified fields
 * @param {{}} director
 * @param {Array} fields
 * @param {function} callback
 */
exports.updateDirector = function(director, fields, callback) {
  for (var i = 0; i < fields.length; i++) {
    console.log(fields[i]);
  }
}