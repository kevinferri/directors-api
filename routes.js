/*************************************
 * Defines all the routes for the API
**************************************/

module.exports = (function() {
  'use strict';

  var router = require('express').Router(),
    directors = require('./controllers/directors.js'),
    middleware = require('./lib/route-middleware.js')

  router.post('/directors', directors.postDirector);
  router.get('/directors', directors.getDirectors);
  router.get('/directors/:id', middleware.isValidId, directors.getDirector);
  router.delete('/directors/:id', middleware.isValidId, directors.deleteDirector);
  router.put('/directors/:id', middleware.isValidId, directors.putDirector);

  return router;

})();