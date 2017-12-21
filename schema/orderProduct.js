var mongoose = require('mongoose');

var OrderedProductSchema = mongoose.Schema({
    productId           :   String,
    productName         :   String,
    price               :   Number,
    discount            :   Number,
    quantity            :   Number
});

module.exports = OrderedProductSchema;