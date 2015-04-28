 /******************************************************
 * The schema for the Director model
 * full_name and dob need to come from Livestream's API
*******************************************************/

var mongoose = require('mongoose');

var directorSchema = mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  full_name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    // This isn't required because some dob's are null in the Livestream API and will throw an error if making it required
    required: false
  },
  favorite_camera: {
    type: String,
    required: false
  },
  favorite_movies: {
    type: Array,
    required: false
  }
});

module.exports = mongoose.model('Director', directorSchema);