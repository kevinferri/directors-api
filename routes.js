/*************************************
 * Defines all the routes for the API
**************************************/

module.exports = (function() {
  'use strict';

  var router = require('express').Router(),
    directors = require('./controllers/directors.js');

  router.post('/directors', directors.postDirector);
  router.get('/directors', directors.getDirectors);
  router.get('/directors/:id', directors.getDirector);
  //router.put('/directors/:id', directors.putDirector);

  return router;

})();