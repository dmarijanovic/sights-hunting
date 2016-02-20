var mongoose = require('mongoose');

var DeviceSchema = mongoose.Schema({
    gcmId: String,
    osVersion: String,
    appVersion: String,
    type: { type: String, enum: ['ANDROID', 'IPHONE'] }
}, { timestamps: true });

module.exports = mongoose.model('Device', DeviceSchema);