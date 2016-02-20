var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MapSchema = new Schema({
    name: String,
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device'
    },
    status: {type: String, enum: ['OPEN', 'ACTIVE', 'ON_APPROVE', 'APPROVED']}
}, { timestamps: true });

module.exports = mongoose.model('Map', MapSchema);
