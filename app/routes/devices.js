var Device = require('../models/device');

module.exports = function(router) {

    router.route('/devices')
        .post(function(req, res) {
            Device(req.body).save(function(err, device) {
                if (err) {
                    res.status(500);
                    res.send(err);
                }

                console.log('Registering new device id ' + device._id);
                res.json(device);
            });
        });
}