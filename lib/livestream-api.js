/****************************************************************************************************
 * Responsible for any interaction with Livestream's API
 * Urls and resources that are needed from Livestream's API are stored in config/livestream-config.js
*****************************************************************************************************/

var request = require('request'),
  livestreamConfig = require('../config/livestream-config.js'),
  errors = require('../lib/errors.js');

var dbOperations = function() {

  var self = this;

  self.errors = {
    noLivestreamAccount: function(id) {
      return {
        name: 'NoLivestreamAccount',
        message: 'There is no Livestream director with the id of ' + id
      }
    }
  };

  /**
   * Gets a director document from Livestream's API and filters out the fields we need (livestream_id, full_name, dob) then passes it into a callback
   * @param {int} id
   * @param {String} resource
   * @param {function} callback
   */
  self.getLivestreamDirector = function(id, callback) {
    var url = livestreamConfig.url + '/' + livestreamConfig.resource.accounts + '/' + id;

    request({ url: url, json: true }, function(err, response, body) {

      if (err) {
        callback(err);
      }

      if (body.id === undefined || body.id === null) {
        callback(null, self.errors.noLivestreamAccount(id));
        return;
      }

      if (response.statusCode === 200) {
        var director = {
          _id: body.id,
          full_name: body.full_name,
          dob: body.dob,
        };
        callback(director);
      }

    });
  };

}

module.exports = new dbOperations();