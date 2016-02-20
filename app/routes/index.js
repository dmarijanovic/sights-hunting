var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('Sight Hunter');
});

module.exports = router;