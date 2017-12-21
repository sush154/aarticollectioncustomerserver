var mongoose = require('mongoose');

var deliverySchema = require('../schema/delivery');

var deliveryModel = mongoose.model('delivery', deliveryModel);

module.exports = deliveryModel;