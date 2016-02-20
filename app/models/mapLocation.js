var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Specify coordinates in this order: “longitude, latitude.”
var MapLocationSchema = new Schema({
    timestampGps: Date,
    imagePath: String,
    loc: {
        type: { type: String },
        coordinates: { type: [Number] }
    },
    mapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Map'
    }
}, { timestamps: true });
// typeKey: '$type' ???

// set static methods
MapLocationSchema.statics.cleanRequestObject = function(mapLocation) {
    delete mapLocation.updatedAt;
    delete mapLocation.createdAt;
}

MapLocationSchema.statics.fillFromRequestObject = function(mapLocation) {
        mapLocation.loc = {
            type: 'Point',
            coordinates: [
                mapLocation.longitude,
                mapLocation.latitude
            ]
        }
        
        mapLocation.mapId = mapLocation.map._id;
        
}

// define the index
MapLocationSchema.index({ loc: '2dsphere' });

module.exports = mongoose.model('MapLocation', MapLocationSchema);