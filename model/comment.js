var mongoose = require('mongoose');

var CommentSchema = require('../schema/comment');

var CommentModel = mongoose.model('comment', CommentSchema);

module.exports = CommentModel;