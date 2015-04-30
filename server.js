var express = require('express'),
  app = express(),
  router = express.Router(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  dbInfo = require('./config/database.js'),
  routes = require('./routes'),
  port = 3000;

// Use MongoDB to store data and Mongoose to model that data
mongoose.connect(dbInfo['conn']);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', routes);

// 500 status error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

app.set('port', process.env.PORT || port);
app.listen(app.get('port'));

console.log('Server is listening on port ' + app.get('port'));