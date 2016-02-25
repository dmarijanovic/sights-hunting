var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var GameSchema = new Schema({
    name: String,
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device'
    },
    type: {type: String, enum: ['CREATED', 'OPEN']}
}, { timestamps: true });



module.exports = mongoose.model('Game', MapSchema);
