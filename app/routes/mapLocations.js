var MapLocation = require('../models/mapLocation');
var multiparty = require('multiparty');

module.exports = function(router) {
    
    var getModel = function(req, cb) {
        var form = new multiparty.Form();
 
        form.parse(req, function(err, fields, files) {

            var mapLocationJson;

            Object.keys(fields).forEach(function(name) {
                mapLocationJson = JSON.parse(fields[name][0]);
            });

            Object.keys(files).forEach(function(name) {
                mapLocationJson.imagePath = files[name][0].path;
            });

            MapLocation.cleanRequestObject(mapLocationJson);
            MapLocation.fillFromRequestObject(mapLocationJson);

            cb(mapLocationJson);
        });
        
    } 

    router.route('/device/:device_id/maps/:map_id/maplocations')
        .get(function(req, res) {
            // not in use
            var mapLocationJson = {
                
            };

            mapLocationJson.loc = {
                type: 'Point',
                coordinates: [
                    -110.8571443,
                    34.4586858
                ]
            }

            console.log('before', mapLocationJson)

            MapLocation(mapLocationJson).save(function(err, mapLocation) {
                if (err) res.send(err);

                console.log("MapLocation Saved: ", mapLocation)
                res.json(mapLocation);
            });
        })
        .post(function(req, res) {
            getModel(req, function(mapLocation) {
                MapLocation(mapLocation).save(function(err, mapLocation) {
                    if (err) {
                        res.status(500);
                        res.send(err);
                    }

                    var model = mapLocation.toObject();

                    model.url = "http://www.todo.com/" + mapLocation._id;
                    model.thumbnailUrl = "http://www.todo.com/" + mapLocation._id;

                    console.log("Saved: ", model._id)
                    res.json(model);
                });
            });
        })
        .put(function(req, res) {
            getModel(req, function(mapLocation) {
                MapLocation.update({ '_id': mapLocation._id}, mapLocation, function(err, numAffected) {
                    if (err) {
                        res.status(500);
                        res.send(err);
                    }

                    MapLocation.findById(mapLocation._id, function(err, mapLocation) {
                        if (err) {
                            res.status(500);
                            res.send(err);
                        }

                        console.log("Update: ", mapLocation._id)
                        res.json(mapLocation);
                    })
                });
            });
        });
}