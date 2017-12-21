var mongoose = require('mongoose');

var UserSchema = require('../schema/user');

var UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;