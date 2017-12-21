var mongoose = require('mongoose');

var ReviewSchema = mongoose.Schema({
    customer        :   {type: mongoose.Schema.Types.ObjectId, ref : 'customer'},
    reviewDate      :   Date,
    ratings         :   Number,
    product         :   {type : mongoose.Schema.Types.ObjectId, ref : 'product'},
    comments        :   {type : mongoose.Schema.Types.ObjectId, ref : 'comment'}
});

module.exports = ReviewSchema;