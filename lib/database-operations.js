/*****************************
 * Handles database operations
******************************/

var Director = require('../models/Director.js'),
  errors = require('../lib/errors.js'),
  utils = require('../lib/utils.js');

var dbOperations = function() {
  var self = this;

  self.errors = {
    directorNotFound: function(id) {
      return {
        name: 'NotFoundError',
        message: 'There is no registered director with the id of ' + id
      }
    }
  };

  /**
   * Inserts a new director document into the database
   * @param {{}} obj
   */
  self.insertDirector = function(obj, callback) {
    var director = new Director({
      _id: obj._id,
      full_name: obj.full_name,
      dob: obj.dob,
    });
    director.save(function(err) {
      if (err) {
        callback(err);
      }
      callback(director);
    });
  };

  self.findDirectorById = function(id, callback) {
    Director.findOne({ '_id': id }, function(err, director) {
      if (err) {
        console.log('no');
        callback(err);
      }
      if (director) {
        callback(director);
      } else {
        callback(self.errors.directorNotFound(id));
      }
    });
  };

  self.findAllDirectors = function(callback) {
    Director.find(function(err, directors) {
      if (err) {
        callback(err);
      }
      callback(directors);
    }); 
  }

}

module.exports = new dbOperations();