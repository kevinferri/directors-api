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
  dbOperations.findDirectorById(req.params.id, function(director) {
    res.json(director);
  });
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
    var livestreamId = JSON.parse(body).livestream_id;

    // Need to pass livestream_id in the body of the request
    if (livestreamId === undefined || livestreamId === null) {
      res.json(errors.badRequestBody(body));
    }

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
            dbOperations.insertDirector(director);
            res.json(director);
          }
        });
      }
    });
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
    // update the director with the id in the url
    // use the data from the request body
  });
}
