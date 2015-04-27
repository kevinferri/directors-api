var express = require('express'),
  app = express(),
  router = express.Router(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  dbInfo = require('./config/database.js'),
  routes = require('./routes'),
  port = 3000;

// Use mongoDB to store data
mongoose.connect(dbInfo['conn']);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', routes);

app.set('port', process.env.PORT || port);
app.listen(app.get('port'));

console.log('Server is listening on port ' + app.get('port'));