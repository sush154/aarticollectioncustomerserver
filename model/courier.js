var mongoose = require('mongoose');

var CourierSchema = require('../schema/courier');

var CourierModel = mongoose.model('courier', CourierSchema);

module.exports = CourierModel;