/*********************************************************************************************************************************
 * Handles HTTP requests that are defined in ./routes.js
 * Function names correlate with the route and HTTP verb they control
 * Each function is responsible for santizing and validating incomming data and making sure it sends proper data to db operations
**********************************************************************************************************************************/

var Director = require('../models/Director.js'),
  livestreamAPI = require('../lib/livestream-api.js'),
  dbOperations = require('../lib/database-operations.js'),
  errors = require('../lib/errors.js'),
  utils = require('../lib/utils.js');

/**
 * Gets an individual director document
 * @param {{}} req
 * @param {{}} res
 */
exports.getDirector = function(req, res) {
  var id = req.params.id;
  if (utils.isValidId(id)) {
    dbOperations.findDirectorById(id, function(director) {
      res.json(director);
    });
  } else {
    res.json(errors.invalidId(id));
  }
}

/**
 * Inserts an individual director document into the database based on existing directors in Livestream's API and sends that director
 * @param {{}} req
 * @param {{}} res
 */
exports.postDirector = function(req, res) {

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
      var livestreamId = JSON.parse(body).livestream_id;

      // Need to pass livestream_id in the body of the request
      if (livestreamId === undefined || livestreamId === null) {
        res.json(errors.badRequestBody(body));
      }

      if (utils.isValidId(livestreamId)) {
        livestreamAPI.getLivestreamDirector(livestreamId, function(director) {
          // If the director isn't found in the Livestream API, we can't add it to our API
          if (director === undefined || director === null) {
            res.json(errors.noLivestreamAccount(livestreamId));
          } else {
            dbOperations.findDirectorById(director._id, function(foundDirector) {
              // If we find the director, it's already in the db and we don't want to add it again
              if (foundDirector._id) {
                res.json(errors.alreadyRegistered(foundDirector._id));
              } else {
                // Add the director in the db and send it as a response
                dbOperations.insertDirector(director, function(director) {
                  res.json(director);
                });
              }
            });
          }
        });
      } else {
        res.json(errors.invalidId(livestreamId));
      }
    } else {
      res.json(errors.invalidJson(body));
    }
  });

}

/**
 * Gets all director documents
 * @param {{}} req
 * @param {{}} res
 */
exports.getDirectors = function(req, res) {
  dbOperations.findAllDirectors(function(directors) {
    res.json(directors);
  });
}

/**
 * Updates an individual director
 * @param {{}} req
 * @param {{}} res
 */
exports.putDirector = function(req, res) {
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
          dbOperations.updateDirector(director, [{ favorite_camera: 'something', favorite_movies: 'something'}], function() {

          });
        });
      } else {
        res.json(errors.invalidId);
      }

    } else {
      res.json(errors.invalidJson(body));      
    }

  });
}
