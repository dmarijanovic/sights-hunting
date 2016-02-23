var MapLocation = require('../models/mapLocation');
var multiparty = require('multiparty');
var fs = require('fs');
var rootDir = require('path').dirname(require.main.filename);
var easyImage = require('easyimage');

module.exports = function(router) {
    
    var getModel = function(req, cb) {
        var form = new multiparty.Form();
 
        form.parse(req, function(err, fields, files) {

            var mapLocationJson;

            Object.keys(fields).forEach(function(name) {
                mapLocationJson = JSON.parse(fields[name][0]);
            });

            Object.keys(files).forEach(function(name) {
                mapLocationJson.localPath = files[name][0].path;
            });

            MapLocation.cleanRequestObject(mapLocationJson);
            MapLocation.fillFromRequestObject(mapLocationJson);

            cb(mapLocationJson);
        });
        
    } 

    router.route('/device/:device_id/maps/:map_id/maplocations')
        .get(function(req, res, next) {
            MapLocation.find({ mapId : { $eq: req.params.map_id } }, function(err, mapLocations) {
                if (err) {
                    var error = new Error('Error finding map locations');
                    error.inner = err;
                    next(error);
                    return;
                }
                res.json(mapLocations);  
            });
        })
        .post(function(req, res, next) {
            getModel(req, function(model) {
                MapLocation(model).save(function(err, mapLocation) {
                    if (err) {
                        var error = new Error('Error saving model');
                        err.inner = err;
                        next(error);
                        return;
                    }

                    // copy file from tmp folder to public image folder, name of file should be same as model _id
                    var imageName = mapLocation._id + '.jpg';
                    var thumbnailName = mapLocation._id + '_thumbnail.jpg';
                    var imagePath = rootDir + '/public/images/' + imageName;
                    var thumbnailPath = rootDir + '/public/images/' + thumbnailName;
                    fs.rename(model.localPath, imagePath);

                    // make thumnnial
                    easyImage.thumbnail({
                        src: imagePath,
                        dst: thumbnailPath,
                        width: 64
                    }).then(function(image) {
                        console.log('image thumbnail done')
                    }, function(err) {
                        console.log(err);
                    } ) ;

                    var updateModel = {
                        url: 'http://10.0.2.2:9761/images/' + imageName,
                        thumbnailUrl: 'http://10.0.2.2:9761/images/' + thumbnailName
                    }    

                    MapLocation.findByIdAndUpdate(mapLocation._id, updateModel, function(err, mapLocation) {
                        if (err) {
                            var error = new Error('Error updating model');
                            err.inner = err;
                            next(error);
                            return;
                        }

                        console.log("Saved: ", mapLocation._id)
                        res.json(mapLocation);
                    });
                });
            });
        });

    router.route('/device/:device_id/maps/:map_id/maplocations/:map_location_id')
        .put(function(req, res) {
            // this will not work now
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
        })
        .delete(function(req, res, next) {
            MapLocation.findByIdAndRemove(req.params.map_location_id, function(err, count) {
                if (err) {
                    var error = new Error('Error removing location');
                    error.inner = err;
                    next(error);
                    return;
                }

                res.json({ message: 'OK' });
            });
        });
}