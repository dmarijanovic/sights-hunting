var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
var aws = require('aws-sdk');

var env = process.env.NODE_ENV
console.log('Environment set to: ' + env);
// MongoDb config
var mongoose = require('mongoose');
if (env == 'development') {
    mongoose.connect('mongodb://localhost/sighthunting');
} else {
    mongoose.connect(process.env.MONGOLAB_URI);
}

// AWS config
aws.config.loadFromPath('./config/aws.json');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 9761;
var logError = function(message) {
    console.error(moment().format() + ' - ' + message);
}

var indexRouter = require('./app/routes/index.js');
var apiRouter = require('./app/routes/indexApi');

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use(function(req, res, next) {
    logError("No route: " + req.url);
    res.status(404);
    res.json({ message: 'No route'});
});
app.use(function(err, req, res, next) {
    logError(err.inner ? err.inner.stack : err);

    res.status(err.status ? err.status : 500);
    res.json({ message: err.message });
});

app.listen(port);
console.log('Server started on port ' + port);
