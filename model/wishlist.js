var mongoose = require('mongoose');

var wishlistSchema = require('../schema/wishlist');

var wishlisModel = mongoose.model('wishlist', wishlistSchema);

module.exports = wishlisModel;