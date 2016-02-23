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


MapSchema.statics.getMapsByDeviceId = function(device_id, updatedAt, cb) {
    var Device = this.model('Device'), Map = this.model('Map');
    Device.findById(device_id, function(err, device) {
        if (err) throw err;

       Device.find( { deviceInternalId: { $eq: device.deviceInternalId } }, function(err, devices) {
           if (err) throw err;

           var deviceIds = u.map(devices, function(device) {
              return device._id; 
           });

            var query = {
                deviceId: { $in: deviceIds},
                updatedAt: updatedAt ? { $gt: updatedAt } : { $ne: null }
            };

            Map.find(query, cb);
       });
    });
};


module.exports = mongoose.model('Map', MapSchema);
