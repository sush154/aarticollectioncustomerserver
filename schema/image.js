var mongoose = require('mongoose');

var ImageSchema = mongoose.Schema({
    img: { data: Object, contentType: String },
    projectId : String
});

module.exports = ImageSchema;