/*******************************************************************
 * Handles HTTP requests that are defined in ./routes.js
 * If an error occurs, it is sent to the error handling middleware
*******************************************************************/

var Director = require('../models/Director.js'),
  livestreamAPI = require('../lib/livestream-api.js'),
  utils = require('../lib/utils.js');

var directorCtrl = function() {

  var self = this;

  // Helpers specificly needed for the director controller
  self.helpers = {

    /**
     * Gets the body of a HTTP request and passes it into a callback
     * @param {{}} req
     * @param {{}} res
     */
    getRequestBody: function(req, res, callback) {
      var body = '';

      req.on('data', function (data) {
        body += data;
        // Too much data so we need to kill the connection
        if (body.length > 1e6) {
          res.status(400).json(self.responses.tooMuchData());
          req.connection.destroy();
        }
      });

      req.on('end', function () {
        if (utils.isValidJson(body)) {
          callback(body);
        } else {
          res.status(400).json(self.responses.invalidJson(body));
        }
      });
    }
  };

  // Custom response messages for the director resource
  self.responses = {

    alreadyRegistered: function(id) {
      return {
        name: 'AlreadyRegistered',
        message: 'The director with Livestream id ' + id + ' is already registered'
      }
    },

    tooMuchData: function() {
      return {
        name: 'TooMuchData',
        message: 'Too much POST data'
      }
    },

    badRequestBody: function(fields) {
      var response = { name: 'BadRequestBody' };
      if (fields.length > 0) {
        var message = '';
        for (var i = 0; i < fields.length; i++) {
          if (i === fields.length - 1) {
            message += fields[i];
          } else {
            message += fields[i] + ' or ';
          }
        }
        response.message = message;
      } else {
        response.message = 'Bad request error'
      }
      return response;
    },

    invalidJson: function(str) {
      return {
        name: 'InvalidJson',
        message: str + ' is not valid JSON',
      }
    },

    directorNotFound: function(id) {
      return {
        name: 'NotFoundError',
        message: 'There is no registered director with the id of ' + id
      }
    },

  };

  /**
   * Gets an individual director document
   * @param {{}} req
   * @param {{}} res
   */
  self.getDirector = function(req, res, next) {
    var id = req.params.id;
    
    Director.findOne({ _id: id}, function(err, director) {
      if (err) {
        err.message = 'Internal server error';
        next(err);
      }
      if (!director) {
        res.status(404).json(self.responses.directorNotFound(id));
      } else {
        res.status(200).json(director);
      }
    });
  };

  /**
   * Gets all director documents
   * @param {{}} req
   * @param {{}} res
   */
  self.getDirectors = function(req, res, next) {
    Director.find({}, function(err, directors) {
      if (err) {
        err.message = 'Internal server error';
        next(err);
      }
      res.status(200).json(directors);
    });
  };

  /**
   * Inserts an individual director document into the database based on existing directors in Livestream's API and sends that director
   * @param {{}} req
   * @param {{}} res
   */
  self.postDirector = function(req, res, next) {

    self.helpers.getRequestBody(req, res, function(body) {
      
      var livestreamId = JSON.parse(body).livestream_id;

      // Need to pass livestream_id in the body of the request
      if (!livestreamId) {
        res.status(400).json(self.responses.badRequestBody(['livestream_id']));
      } else {
        livestreamAPI.getLivestreamDirector(livestreamId, function(director, err) {

          if (!director) {
            res.status(err.status).json({ 
              'name': err.name, 'message': err.message 
            });
          } else {
            Director.findOne({ 'livestream_id': director._id }, function(err, foundDirector) {

              // If we find the director, it's already in the db and we don't want to add it again
              if (foundDirector) {
                res.status(400).json(self.responses.alreadyRegistered(director._id));
              } else {
              
                // Set up the director to be inserted into our database
                var directorToInsert = new Director({
                  full_name: director.full_name,
                  dob: director.dob,
                  livestream_id: director._id
                });
                
                // Insert the director in the db and send it as a response
                directorToInsert.save(function(err, director) {
                  if (err) {
                    err.message = 'Internal server error';
                    next(err);
                  }
                  res.status(200).json(directorToInsert);
                });
              }
            });
          }
        });
      }
    });

  };

  /**
   * Removes an individual director document
   * @param {{}} req
   * @param {{}} res
   */
  self.deleteDirector = function(req, res, next) {
    var id = req.params.id;

    Director.findByIdAndRemove({ _id: id }, function (err, director) {
      if (err) {
        err.message = 'Internal server error';
        next(err);
      }
      if (!director) {
        res.status(404).json(self.responses.directorNotFound(id))
      } else {
        res.status(200).json(director);
      }
    });
  };

  /**
   * Updates the favorite_camera or favorite_movies fields for an individual director
   * @param {{}} req
   * @param {{}} res
   */
  self.putDirector = function(req, res, next) {
    self.helpers.getRequestBody(req, res, function(body) {

      var favorite_camera = JSON.parse(body).favorite_camera,
        favorite_movies = JSON.parse(body).favorite_movies,
        id = req.params.id;

      // Need to pass favorite_camera or favorite_movies in the request body  
      if (!favorite_camera && !favorite_movies) {
        res.status(400).json(self.responses.badRequestBody(['favorite_camera', 'favorite_movies']));
      } else {
        Director.findOne({ _id: id }, function (err, director) {

          if (err) {
            err.message = 'Internal server error';
            next(err);
          }

          // If we don't find the director, return a 404
          if (!director) {
            res.status(404).json(self.responses.directorNotFound(id));
          } else {

            // If favorite_movies is passed as a string, we must convert it into an array
            if (favorite_movies && !utils.isArray(favorite_movies)) {
              if (typeof favorite_movies === 'string') {
                favorite_movies = favorite_movies.split(', ');
              } else {
                res.status(404).json(self.responses.badRequestBody([]));
              }
            }

            // If favorite_camera is passed, update the document with the value
            if (favorite_camera) {
              director.favorite_camera = favorite_camera;
            }

            // If favorite_movies is passed, update the document with the value
            if (favorite_movies) {
              director.favorite_movies = favorite_movies;
            }

            director.save(function (err, director) {
              if(err) {
                err.message = 'Internal server error';
                next(err);
              }
              res.status(200).json(director);
            });
          }
        });
      }
    });
  };

}

module.exports = new directorCtrl();