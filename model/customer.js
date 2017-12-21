var mongoose = require('mongoose');

var CustomerSchema = require('../schema/customer');

var CustomerModel = mongoose.model('customer', CustomerSchema);

module.exports = CustomerModel;