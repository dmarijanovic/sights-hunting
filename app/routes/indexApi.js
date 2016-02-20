var express = require('express');
var router = express.Router();

var users = require('./users')(router);
var maps = require('./maps')(router);
var mapLocations = require('./mapLocations')(router);
var devices = require('./devices')(router);


router.get('/', function(req, res) {
    res.json({ message: 'Welcome to SightHunter API!'});
});

module.exports = router;