/*******************************************************
 * Handles HTTP requests that are defined in ./routes.js
********************************************************/

var Director = require('../models/Director.js'),
  livestreamAPI = require('../lib/livestream-api.js'),
  dbOperations = require('../lib/database-operations.js'),
  errors = require('../lib/errors.js'),
  utils = require('../lib/utils.js');

var directorCtrl = function() {

  var self = this;

  self.errors = {
    alreadyRegistered: function(id) {
      return {
        name: 'AlreadyRegistered',
        message: 'The director with id ' + id + ' is already registered'
      }
    },
    tooMuchData: function() {
      return {
        name: 'TooMuchData',
        message: 'Too much POST data'
      }
    },
    badRequestBody: function(body) {
      return {
        name: 'BadRequestBody',
        message: 'Bad Request body: ' + body
      }
    },
    invalidJson: function(str) {
      return {
        name: 'InvalidJson',
        message: str + ' is not valid JSON',
      }
    }

  };

  /**
   * Gets the body of a HTTP request and passes it into a callback
   * @param {{}} req
   * @param {{}} res
   */
  self.getRequestBody = function(req, res, callback) {
    var body = '';

    req.on('data', function (data) {
      body += data;
      // Too much data so we need to kill the connection
      if (body.length > 1e6) {
        res.json(self.errors.tooMuchData());
        req.connection.destroy();
      }
    });

    req.on('end', function () {
      if (utils.isValidJson(body)) {
        callback(body);
      } else {
        res.json(self.errors.invalidJson(body));
      }
    });
  }

  /**
   * Gets an individual director document
   * @param {{}} req
   * @param {{}} res
   */
  self.getDirector = function(req, res) {
    var id = req.params.id;
    if (utils.isValidId(id)) {
      dbOperations.findDirectorById(id, function(director) {
        res.json(director);
      });
    } else {
      res.json(errors.invalidId(id));
    }
  };

  /**
   * Inserts an individual director document into the database based on existing directors in Livestream's API and sends that director
   * @param {{}} req
   * @param {{}} res
   */
  self.postDirector = function(req, res) {

    var body = '';

    req.on('data', function (data) {
      body += data;

      // Too much data so we need to kill the connection
      if (body.length > 1e6) {
        res.json(self.errors.tooMuchData());
        req.connection.destroy();
      }

    });

    req.on('end', function () {

      if (utils.isValidJson(body)) {
        var livestreamId = JSON.parse(body).livestream_id;

        // Need to pass livestream_id in the body of the request
        if (livestreamId === undefined || livestreamId === null) {
          res.json(self.errors.badRequestBody(body));
        }

        if (utils.isValidId(livestreamId)) {
          livestreamAPI.getLivestreamDirector(livestreamId, function(director, err) {
            // If the director isn't found in the Livestream API, we can't add it to our API
            if (err) {
              res.json(err);
            } else {
              dbOperations.findDirectorById(director._id, function(foundDirector) {
                // If we find the director, it's already in the db and we don't want to add it again
                if (foundDirector._id) {
                  res.json(self.errors.alreadyRegistered(foundDirector._id));
                } else {
                  // Add the director in the db and send it as a response
                  dbOperations.insertDirector(director, function(director) {
                    res.json({
                      livestream_id: director._id,
                      full_name: director.full_name,
                      favorite_camera: '',
                      favorite_movies: []
                    })
                  });
                }
              });
            }
          });
        } else {
          res.json(errors.invalidId(livestreamId));
        }
      } else {
        res.json(self.errors.invalidJson(body));
      }
    });

  };

  /**
   * Gets all director documents
   * @param {{}} req
   * @param {{}} res
   */
  self.getDirectors = function(req, res) {
    dbOperations.findAllDirectors(function(directors) {
      res.json(directors);
    });
  };


}

module.exports = new directorCtrl();



/**
 * Updates an individual director
 * @param {{}} req
 * @param {{}} res
 */
/*exports.putDirector = function(req, res) {
  var body = '';

  req.on('data', function (data) {
    body += data;

    // Too much data so we need to kill the connection
    if (body.length > 1e6) {
      res.json(errors.tooMuchData());
      req.connection.destroy();
    }

  });

  req.on('end', function () {
    if (utils.isValidJson(body)) {
      var id = req.params.id,
        favorite_camera = JSON.parse(body).favorite_camera,
        favorite_movies = JSON.parse(body).favorite_movies;

      // Need to pass either favorite_camera or favorite_movies in the request body
      if ((favorite_camera === undefined || favorite_camera === null) &&  (favorite_movies === undefined || favorite_movies === null)) {
        res.json(errors.badRequestBody(body));
      }

      if (utils.isValidId(id)) {
        dbOperations.findDirectorById(id, function(director) {
          dbOperations.updateDirector(director, [], function() {

          });
        });
      } else {
        res.json(errors.invalidId);
      }

    } else {
      res.json(errors.invalidJson(body));      
    }

  });
}*/