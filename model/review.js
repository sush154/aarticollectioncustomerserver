var mongoose = require('mongoose');

var ReviewSchema = require('../schema/review');

var ReviewModel = mongoose.model('review', ReviewSchema);

module.exports = ReviewModel;