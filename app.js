var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    connection = require('./connection');

var LoginMiddleware = require('./router/login/router');
var CourierMiddleware = require('./router/courier/router');
var ReviewMiddleware = require('./router/review/router');
var ProductMiddleware = require('./router/product/router');
var CategoryMiddleware = require('./router/category/router');
var OrderMiddleware = require('./router/order/router');
var AuthMiddleware = require('./router/auth/router');
var RegisterMiddleware = require('./router/register/router');
var LogoutMiddleware = require('./router/logout/router');

app.use(bodyParser.json());

app.use('/', [LoginMiddleware, CourierMiddleware, ReviewMiddleware, ProductMiddleware,
                CategoryMiddleware, OrderMiddleware, AuthMiddleware, RegisterMiddleware, LogoutMiddleware]);

module.exports = app;

