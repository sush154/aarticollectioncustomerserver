var mongoose = require('mongoose');

var ImageSchema = require('../schema/image');

var ImageModel = mongoose.model('image', ImageSchema);

module.exports = ImageModel;