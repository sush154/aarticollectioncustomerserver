var express = require('express'),
    CourierMiddleware = express(),
    CourierRouter = express.Router(),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    CourierModel = require('../../model/courier'),
    config = require('../../config');

CourierRouter.use(cookieParser());
CourierRouter.use(session({ secret: 'secretkey', cookie: { httpOnly: false,secure:false,expires: new Date(Date.now() + (1*24*60*60*1000))}, resave: true, saveUninitialized: true  }));     //session secret


CourierRouter.use(function(req, res, next){
	var origin = req.headers.origin;
    if(config.client.connectionUrl.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }

    //res.header("Access-Control-Allow-Origin", config.client.connectionUrl);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    /*if((req.session.cookie._expires > (new Date())) && req.cookies['token']){
        next();
    } else {
        res.cookie("token", "", { expires: new Date() });
        return res.json({data: {status : 401}});
    }*/
    next();
});

/*
*   This method retrieves all the couriers names
*/
CourierRouter.get('/getAllCouriers', function(req, res){
    CourierModel.find({}, function(err, courier){
        if(err){console.log(err); return res.json({data:{status : 500}});}
        else {
            return res.json({data: {status: 200, courier}});
        }
    })
});


/*
*   This method adds new courier name
*/
/*CourierRouter.post('/addCourier', function(req, res) {
    var newCourier = new CourierModel;

    newCourier.name = req.body.courierName;

    newCourier.save(function(err, courier){
        if(err){console.log(err); return res.json({data:{status : 500}});}

        else {
            return res.json({data: {status: 200, Id: courier._id}});
        }
    });
});*/

/*
*   This method updates courier Name
*/
/*CourierRouter.post('/updateCourier', function(req, res){
    var updatedCourier = {};

    if(req.body.courierName !== ''){
        updatedCourier.name = req.body.courierName;
    }

    CourierModel.update({_id : req.body._id}, {$set : updatedCourier}, function(err, courier){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data: {status: 200}});
        }
    });
});*/

/*
*   This method deletes courier
*/
/*CourierRouter.post('/deleteCourier', function(req, res){
    CourierModel.findOne({_id : req.body._id}, function(err, courier){
        CourierModel.findByIdAndRemove({_id : courier._id}, function(err, deletedCourier){
            if(err){
                console.log(err);
                return res.json({data:{status : 500}});
            }else {
                return res.json({data: {status: 200}});
            }
        });
    });
});*/

CourierMiddleware.use('/courier', CourierRouter);

module.exports = CourierMiddleware;