/****************************************************************************************************
 * Responsible for any interaction with Livestream's API
 * Urls and resources that are needed from Livestream's API are stored in config/livestream-config.js
*****************************************************************************************************/

var request = require('request'),
  livestreamConfig = require('../config/livestream-config.js');

var livestreamAPI = function() {

  var self = this;

  self.responses = {
    noLivestreamAccount: function(id) {
      return {
        status: 400,
        name: 'NoLivestreamAccount',
        message: 'There is no Livestream director with the id of ' + id
      }
    },
    invalidLivestreamId: function(id) {
      return {
        status: 400,
        name: 'InvalidLivestreamId',
        message: id + ' is an invalid Livestream id'
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

      if (response.statusCode === 404) {
        callback(null, self.responses.noLivestreamAccount(id));
        return;
      }

      if (response.statusCode === 400) {
        callback(null, self.responses.invalidLivestreamId(id));
        return
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

module.exports = new livestreamAPI();