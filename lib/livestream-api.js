var request = require('request'),
  livestreamConfig = require('../config/livestream-config.js'),
  errors = require('../lib/errors.js');

/**
 * Gets a director document from Livestream's API and filters out the fields we need (livestream_id, full_name, dob) then passes it into a callback
 * @param {int} id
 * @param {String} resource
 * @param {function} callback
 */
exports.getLivestreamDirector = function(id, callback) {

  var id = parseInt(id),
    url = livestreamConfig.url + '/' + livestreamConfig.resource.accounts + '/' + id;

  request({ url: url, json: true }, function (err, response, body) {

    if (err) {
      throw err;
    }

    if (body.id === undefined || body.id === null) {
      callback(null);
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
}