var express = require('express'),
    RegisterMiddleware = express(),
    RegisterRouter = express.Router(),
    config = require('../../config');

var CustomerModel = require('../../model/customer');
var UserModel = require('../../model/user');

RegisterRouter.use(function(req, res, next){
	var origin = req.headers.origin;
    if(config.client.connectionUrl.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }

    //res.header("Access-Control-Allow-Origin", config.client.connectionUrl);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

RegisterRouter.post('', function(req, res){
    var newCustomer = new CustomerModel();

    newCustomer.customerName = req.body.customerName;
    newCustomer.address = req.body.address;
    newCustomer.city = req.body.city;
    newCustomer.state = req.body.state;
    newCustomer.pincode = req.body.pincode;
    newCustomer.email = req.body.email;
    newCustomer.phoneNo = req.body.phoneNo;
    newCustomer.role = req.body.role;

    if(req.body.createdFrom === 'admin-portal'){
        newCustomer.save(function(err, cust){
            if(err){
                console.log(err);
                return res.json({data:{status : 500}});
            }else {
                let newUser = new UserModel();

                newUser.email = req.body.email;
                newUser.password = req.body.password;
                newUser.customer = cust._id;

                newUser.save(function(e1, user){
                    if(e1){
                        console.log(e1);
                        return res.json({data:{status : 500}});
                    }else {
                        return res.json({data:{status : 200}});
                    }
                })
            }
        });
    }else if(req.body.createdFrom === 'customer-portal'){
        CustomerModel.findOne({email : req.body.email}, function(e2, doc){
            if(e2){
                console.log(e2);
                return res.json({data:{status : 500}});
            }else {
                if(!doc){
                    newCustomer.save(function(e3, newCust){
                        if(e3){
                            console.log(e3);
                            return res.json({data:{status : 500}});
                        }else {
                            let newUser = new UserModel();

                            newUser.email = req.body.email;
                            newUser.password = req.body.password;
                            newUser.customer = newCust._id;

                            newUser.save(function(e4, u){
                                if(e4){
                                    console.log(e4);
                                    return res.json({data:{status : 500}});
                                }else {
                                    return res.json({data:{status : 200}});
                                }
                            })
                        }
                    })
                }else {
                    let updatedCustomer = {};

                    updatedCustomer.customerName = req.body.customerName;
                    updatedCustomer.address = req.body.address;
                    updatedCustomer.city = req.body.city;
                    updatedCustomer.state = req.body.state;
                    updatedCustomer.pincode = req.body.pincode;
                    updatedCustomer.email = req.body.email;
                    updatedCustomer.phoneNo = req.body.phoneNo;
                    updatedCustomer.role = req.body.role;

                    CustomerModel.update({_id : doc._id}, {$set : updatedCustomer}, function(e5, c){
                        if(e5){
                            console.log(e5);
                            return res.json({data:{status : 500}});
                        }else {
                            let newUser = new UserModel();

                            newUser.email = req.body.email;
                            newUser.password = req.body.password;
                            newUser.customer = doc._id;

                            newUser.save(function(e6, u1){
                                if(e6){
                                    console.log(e6);
                                    return res.json({data:{status : 500}});
                                }else {
                                    return res.json({data:{status : 200}});
                                }
                            })
                        }
                    })
                }
            }
        })
    }
});

RegisterMiddleware.use('/user/register', RegisterRouter);

module.exports = RegisterMiddleware;