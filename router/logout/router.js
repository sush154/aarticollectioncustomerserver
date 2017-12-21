var express = require('express'),
    LogoutMiddleware = express(),
    LogoutRouter = express.Router(),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    config = require('../../config');


LogoutRouter.use(cookieParser());
LogoutRouter.use(session({ secret: 'secretkey', cookie: { httpOnlsy: false,secure:false,expires: new Date(Date.now() + (1*24*60*60*1000))}, resave: false, saveUninitialized: true })); // session secret

LogoutRouter.use(function(req, res, next){
    var origin = req.headers.origin;
    if(config.client.connectionUrl.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }

    //res.header("Access-Control-Allow-Origin", config.client.connectionUrl);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if((req.session.cookie._expires > (new Date())) && req.cookies['token']){
      next();
    } else {
      res.cookie("token", "", { expires: new Date() });
      return res.json({data: {status : 401}});
    }
});

LogoutRouter.get('', function(req, res){
    req.session.destroy(function(err) {

        // Clear Cookies
        res.clearCookie("token");
        res.clearCookie("userRole");

        if(err)res.json({data:{status : 500}});
        else res.json({data:{status : 200}});
    });
});


LogoutMiddleware.use('/user/logout', LogoutRouter);

module.exports = LogoutMiddleware;