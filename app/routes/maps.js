var Map = require('../models/map');
module.exports = function(router) {

    function queryMapById(mapId, res, next) {
        Map.findById(mapId, function(err, map) {
            if (err) {
                var error = new Error('Error querying map');
                err.inner = err;
                next(error);
                return;
            }

            res.json(map);
        })
    }

    router.route('/device/:device_id/maps')
        .get(function(req, res, next) {
            var query = {
                deviceId: { $eq: req.params.device_id},
                updatedAt: req.query.updatedAt ? { $gt: req.query.updatedAt } : { $ne: null }
            };

            Map.find(query, function(err, maps) {
                if (err) {
                    var error = new Error('Error querying maps');
                    error.inner = err;
                    next(error);
                    return;
                }

                res.json(maps);
            });
        })
        .post(function(req, res, next) {
            delete req.body.updatedAt;
            delete req.body.createdAt;

            Map(req.body).save(function(err, map) {
                if (err) {
                    var error = new Error('Error saving map');
                    err.inner = err;
                    next(error);
                    return;
                }

                res.json(map);
            });
        });
        
    router.route('/device/:device_id/maps/:map_id')
        .get(function(req, res, next) {
            queryMapById(req.params.map_id, res, next);
        })
        .put(function(req, res, next) {
            delete req.body._id;
            delete req.body.updatedAt;
            delete req.body.createdAt;
            
            Map.update({ '_id': req.params.map_id }, req.body, function(err, numAffected) {
                if (err) {
                    var error = new Error('Error updating map');
                    error.inner = err;
                    next(err);
                    return;
                }

                queryMapById(req.params.map_id, res, next);
            });
        })
        .delete(function(req, res, next) {
            Map.remove({
                _id: req.params.map_id
            }, function(err, map) {
                if (err){
                    var error = new Error('Error deleting map');
                    error.inner = err;
                    next(error);
                    return;
                }

                res.json({ message: 'Map removed' });
            });
        });
}