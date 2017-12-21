var express = require('express'),
    LoginMiddleware = express(),
    LoginRouter = express.Router(),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    cookieParser = require('cookie-parser'),
    UserModel = require('../../model/user'),
    CustomerModel = require('../../model/customer'),
    config = require('../../config');


passport.serializeUser(function(user, done){

    if(user){
        done(null, user.id);
    }
});

passport.deserializeUser(function(id, done){

    UserModel.findById(id, function(err, user){
        if(user){
            return done(null, user);
        }else{
            return done(null, false);
        }
    })
});

passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
	    passwordField : 'password',
        session: true
    },
    function(email, password, done){

        UserModel.findOne({email: email, password:password}, function(err, user){

            if(err){return done(err);}
            if(!user){
                return done(null, false, {message: "Incorrect username/password"});
            }
            return done(null,user);
        })
    }
));

LoginRouter.use(function(req, res, next){
	var origin = req.headers.origin;
    if(config.client.connectionUrl.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }

    //res.header("Access-Control-Allow-Origin", config.client.connectionUrl);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();

});

LoginRouter.use(cookieParser());
LoginRouter.use(session({ secret: 'secretkey', cookie: { httpOnlsy: false,secure:false,expires: new Date(Date.now() + (1*24*60*60*1000))}, resave: false, saveUninitialized: true })); // session secret
LoginRouter.use(passport.initialize());
LoginRouter.use(passport.session());

LoginRouter.post('', function(req, res, next){

	passport.authenticate('local-login', function(err, user, info){

        if(err){return res.json({data:{status : 500}});}
        if(!user){return res.json({data:{status : 401}});}
        else{
        	/*var token = Math.random().toString() + "-" + user._id;
	        res.cookie('token',token, { httpOnly: false,secure:false,expires: new Date(Date.now() + (1*24*60*60*1000))});

	        return res.json({data:{status : 200}});*/

	        // Check for admin role
            if(req.body.loginFrom === 'admin-portal'){
                CustomerModel.findOne({email : req.body.email}, function(e, customer){
                    if(e){
                        console.log(err);
                        return res.json({data:{status : 500}});
                    }else {
                        if(customer){
                            console.log(customer.role);
                            if(customer.role === 'admin'){
                                var token = Math.random().toString() + "-" + user._id;
                                res.cookie('token',token, { httpOnly: false,secure:false,expires: new Date(Date.now() + (1*24*60*60*1000))});
                                res.cookie('userRole',customer.role, { httpOnly: false,secure:false,expires: new Date(Date.now() + (1*24*60*60*1000))});

                                return res.json({data:{status : 200}});
                            }else {
                                return res.json({data:{status : 202}}); // Unauthorised error
                            }
                        }else {
                            return res.json({data:{status : 401}}); // Credentials does not match
                        }
                    }
                })
            }else {
                // user has logged in from customer portal.
                // TODO: need to add the condition for checking for customer login
                return res.json({data:{status : 200}});
            }
        }

   })(req, res, next);

});



LoginMiddleware.use('/user/login', LoginRouter);

module.exports = LoginMiddleware;