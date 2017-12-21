var mongoose = require('mongoose');

var deliverySchema = mongoose.Schema({
    date    :   Date,
    currentStatus   :   String
});


module.exports = deliverySchema;