var mongoose = require('mongoose');

var CommentSchema = mongoose.Schema({
    comment : String
});

module.exports = CommentSchema;