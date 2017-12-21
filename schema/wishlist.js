var mongoose = require('mongoose');

var wishlistSchema = mongoose.Schema({
    user    :   {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    product :   {type: mongoose.Schema.Types.ObjectId, ref: 'product'}
});

module.exports = wishlistSchema;