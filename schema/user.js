var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    customer    :   {type : mongoose.Schema.Types.ObjectId, ref : 'customer'},
    email       :   String,
    password    :   String
});

module.exports = UserSchema;