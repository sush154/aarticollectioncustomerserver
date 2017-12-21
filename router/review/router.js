var express = require('express'),
    ReviewMiddleware = express(),
    ReviewRouter = express.Router(),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    ReviewModel = require('../../model/review'),
    DateConverter = require('../../util/dateConverter'),
    config = require('../../config')
    CommentModel = require('../../model/comment');


ReviewRouter.use(cookieParser());
ReviewRouter.use(session({ secret: 'secretkey', cookie: { httpOnly: false,secure:false,expires: new Date(Date.now() + (1*24*60*60*1000))}, resave: true, saveUninitialized: true  })); // session secret

ReviewRouter.use(function(req, res, next){
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
*   This method retrieves all the reviews
*/
ReviewRouter.get('/getAllReviews', function(req, res){
    ReviewModel.find({}).populate([{path : 'customer'}, {path : 'product'}, {path : 'comments'}]).exec(function(err, review){
        if(err) {console.log(err); return res.json({data:{status : 500}})}
        else {
            return res.json({data: {status: 200, review}});
        }

    });
});


/*
*   This method retrieves user reviews
*/
ReviewRouter.post('/getUserReviews', function(req, res){
    var userId = req.body.userId;

    ReviewModel.find({customer : userId}).populate([{path : 'customer'}, {path : 'product'}, {path : 'comments'}]).exec(function(err, review){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data: {status: 200, review}});
        }
    });
});


/*
*   This method retrieves reviews for a particular product
*/
ReviewRouter.post('/getProductReviews', function(req, res) {
    var productId = req.body.productId;

    ReviewModel.find({product : productId}).populate([{path : 'customer'}, {path : 'product'}, {path : 'comments'}]).exec(function(err, review){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data: {status: 200, review}});
        }
    });
});


/*
*   This method adds a new review
*/
ReviewRouter.post('/addReview', function(req, res){
    var newReview = new ReviewModel;

    newReview.customer = req.body.userId;
    newReview.reviewDate = DateConverter(req.body.reviewDate);
    newReview.ratings = req.body.ratings;
    newReview.product = req.body.productId;

    

    newReview.save(function(err, review){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            var newComment = new CommentModel;
            newComment.comment = req.body.comment;
        
            newComment.save(function(e1, comment){
                if(e1){
                    console.log(e1);
                    return res.json({data:{status : 500}});
                }else {
                    ReviewModel.update({_id : review._id}, {'$push' : {'comments' : comment._id}}, function(e, uReview){
                        if(e){
                            console.log(e);
                            return res.json({data:{status : 500}});
                        }else {
                            return res.json({data: {status: 200}});
                        }
                    });
                }
            })
            
        }
    })
});


ReviewMiddleware.use('/review', ReviewRouter);

module.exports = ReviewMiddleware;