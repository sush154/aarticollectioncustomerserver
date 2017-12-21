var mongoose = require('mongoose');

var OrderedProductSchema = require('../schema/orderProduct');

var OrderedProductModel = mongoose.model('orderProduct', OrderedProductSchema);

module.exports = OrderedProductModel;