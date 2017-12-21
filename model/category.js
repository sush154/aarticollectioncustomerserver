var mongoose = require('mongoose');

var CategorySchema = require('../schema/category');

var CategoryModel = mongoose.model('category', CategorySchema);

module.exports = CategoryModel;