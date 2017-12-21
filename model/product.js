var mongoose = require('mongoose');

var ProductSchema = require('../schema/product');

var ProductModel = mongoose.model('product', ProductSchema);

module.exports = ProductModel;