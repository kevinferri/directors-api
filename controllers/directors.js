/*******************************************************
 * Handles HTTP requests that are defined in ./routes.js
********************************************************/

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
          res
            .status(400)
            .json(self.responses.tooMuchData());
          req.connection.destroy();
        }
      });

      req.on('end', function () {
        if (utils.isValidJson(body)) {
          callback(body);
        } else {
          res
            .status(400)
            .json(self.responses.invalidJson(body));
        }
      });
    }
  };

  // Response message for the director resource
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
      var message = '';
      for (var i = 0; i < fields.length; i++) {
        if (i === fields.length - 1) {
          message += fields[i];
        } else {
          message += fields[i] + ' or ';
        }
      }
      return {
        name: 'BadRequestBody',
        message: 'Bad Request body: ' + message + ' is required'
      }
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
    internalServerError: function() {
      return {
        name: 'InternalServerError',
        message: 'Internal Server Error'
      }
    }

  };

  /**
   * Gets an individual director document
   * @param {{}} req
   * @param {{}} res
   */
  self.getDirector = function(req, res) {
    var id = req.params.id;
    
    Director.findOne({ _id: id}, function(err, director) {
      if (director === null || director === undefined) {
        res
          .status(404)
          .json(self.responses.directorNotFound(id));
      } else {
        res
          .status(200)
          .json(director);
      }
    });
  };

  /**
   * Gets all director documents
   * @param {{}} req
   * @param {{}} res
   */
  self.getDirectors = function(req, res) {
    Director.find({}, function(err, directors) {
      res
      .status(200)
      .json(directors);
    });
  };

  /**
   * Inserts an individual director document into the database based on existing directors in Livestream's API and sends that director
   * @param {{}} req
   * @param {{}} res
   */
  self.postDirector = function(req, res) {

    self.helpers.getRequestBody(req, res, function(body) {
      
      var livestreamId = JSON.parse(body).livestream_id;

      // Need to pass livestream_id in the body of the request
      if (livestreamId === undefined || livestreamId === null) {
        res
          .status(400)
          .json(self.responses.badRequestBody(['livestreamId']));
      } else {
        livestreamAPI.getLivestreamDirector(livestreamId, function(director, err) {

          if (director === undefined || director === null) {
            res
              .status(err.status)
              .json({ 'name': err.name, 'message': err.message });
          } else {
            Director.findOne({ 'livestream_id': director._id }, function(err, foundDirector) {

              // If we find the director, it's already in the db and we don't want to add it again
              if (foundDirector) {
                res
                  .status(400)
                  .json(self.responses.alreadyRegistered(director._id));
              } else {
              
                // Set up the director to be inserted into our database
                var directorToInsert = new Director({
                  full_name: director.full_name,
                  dob: director.dob,
                  livestream_id: director._id
                });
                
                // Insert the director in the db and send it as a response
                directorToInsert.save(function(err) {
                  res
                    .status(200)
                    .json(directorToInsert);
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
  self.deleteDirector = function(req, res) {
    var id = req.params.id;

    Director.findByIdAndRemove({ _id: id }, function (err, director) {
      if (director === null || director === undefined) {
        res
          .status(404)
          .json(self.responses.directorNotFound(id))
      } else {
        res
          .status(200)
          .json(director);
      }
    });
  };

  /**
   * Updates the favorite_camera or favorite_movies fields for an individual director
   * @param {{}} req
   * @param {{}} res
   */
  self.putDirector = function(req, res) {
    self.helpers.getRequestBody(req, res, function(body) {

      var favorite_camera = JSON.parse(body).favorite_camera,
        favorite_movies = JSON.parse(body).favorite_movies,
        id = req.params.id;

        if (favorite_camera === null || favorite_camera === undefined) {
          res
            .status(400)
            .json(self.responses.badRequestBody(['favorite_camera', 'favorite_movies']));
        }

        Director.findOne({ _id: id }, function (err, director) {

          if (director === null || director === undefined) {
            res
              .status(404)
              .json(self.responses.directorNotFound(id));
          } else {
            director.favorite_camera = favorite_camera;
            director.favorite_movies = favorite_movies;

            director.save(function (err) {
              if(err) {
                res
                  .status(500)
                  .json(self.responses.internalServerError());
              }
              res
                .status(200)
                .json(director);
            });
          }
        });
    });
  };

}

module.exports = new directorCtrl();