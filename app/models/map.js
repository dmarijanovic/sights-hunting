var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var u = require('underscore');

var MapSchema = new Schema({
    name: String,
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device'
    },
    status: {type: String, enum: ['CREATED', 'OPEN', 'ACTIVE', 'ON_APPROVE', 'APPROVED']}
}, { timestamps: true });

var getDeviceFromSameUser = function(context, device_id, cb) {
    var Device = context.model('Device');
    Device.findById(device_id, function(err, device) {
        if (err) throw err;

        Device.find( { deviceInternalId: { $eq: device.deviceInternalId } }, function(err, devices) {
            if (err) throw err;

            var deviceIds = u.map(devices, function(device) {
                return mongoose.Types.ObjectId(device._id);
           });

           cb(deviceIds);
        });
    });
};

MapSchema.statics.getMapsByDeviceId = function(device_id, updatedAt, cb) {
    var Map = this.model('Map');
    getDeviceFromSameUser(this, device_id, function(deviceIds) {

        var query = {
            deviceId: { $in: deviceIds},
            updatedAt: updatedAt ? { $gt: updatedAt } : { $ne: null }
        };

        Map.find(query, cb);
    });
};

MapSchema.statics.communityMaps = function(device_id, cb) {
    var Map = this.model('Map');
    getDeviceFromSameUser(this, device_id, function(deviceIds) {

        var query = {
            deviceId: { $nin: deviceIds },
            status: 'ON_APPROVE', 
        }

        Map.find(query, cb);
    });
};


module.exports = mongoose.model('Map', MapSchema);
