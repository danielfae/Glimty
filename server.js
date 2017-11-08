// -----------------------------------------------------------------
// Require modules
// -----------------------------------------------------------------
var express = require('express'),
    compression = require('compression'),
    app = express(),
    mongoose = require('mongoose');

var bodyParser = require('body-parser');
var request = require('request');

var methodOverride = require('method-override'),
    http = require('http'),
    server = http.createServer(app);

// -----------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------

var config = require('./config/config.json');

// -----------------------------------------------------------------
// Database
// -----------------------------------------------------------------

mongoose.connect(config.production.db, function(err, res) {
  if(err) {
    console.log('ERROR: connecting to Database. ' + err);
  } else {
    console.log('Connected to Mongo Database '+ config.production.url);
  }
}); 

// -----------------------------------------------------------------
// Configure Expresss
// -----------------------------------------------------------------

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser());
app.use(methodOverride());

app.use(compression({
  threshold: 512
}));
app.disable('x-powered-by');

// -----------------------------------------------------------------
// Routes
// -----------------------------------------------------------------

var router = require('./config/routes');
app.use(router);

// -----------------------------------------------------------------
// Error handling
// -----------------------------------------------------------------

app.use(function (err, req, res, next) {
  // treat as 404
  if (err.message
     && (~err.message.indexOf('not found')
     || (~err.message.indexOf('Cast to ObjectId failed')))) {
     return next();
  }
   console.error(err.stack);
   // error page
   res.status(500).render('500', { error: err.stack });
});

// assume 404 since no middleware responded
app.use(function (req, res, next) {
  res.status(404).render('404', {
     error: 'Not found'
  });
});

// -----------------------------------------------------------------
// Start app
// -----------------------------------------------------------------

app.set('port', process.env.PORT || 3000);
server.listen(app.get('port'), function(){
  console.log("Listening on port " + app.get('port'));
});

