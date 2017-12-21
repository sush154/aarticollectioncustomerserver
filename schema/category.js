var mongoose = require('mongoose');

var CategorySchema = mongoose.Schema({
    categoryName        :   String,
    parentCategory      :   String          // Dress Material(1), Saree(2), Curtis(3), Lehengas(4)
});

module.exports = CategorySchema;