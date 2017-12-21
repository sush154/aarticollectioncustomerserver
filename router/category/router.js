var express = require('express'),
    CategoryMiddleware = express(),
    CategoryRouter = express.Router(),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    CategoryModel = require('../../model/category'),
    config = require('../../config');

CategoryRouter.use(cookieParser());
CategoryRouter.use(session({ secret: 'secretkey', cookie: { httpOnly: false,secure:false,expires: new Date(Date.now() + (1*24*60*60*1000))}, resave: true, saveUninitialized: true  })); // session secret

CategoryRouter.use(function(req, res, next){
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
*   This method adds new category
*/
/*CategoryRouter.post('/addCategory', function(req, res){
    var newCategory = new CategoryModel;

    newCategory.categoryName = req.body.categoryName;
    newCategory.parentCategory = req.body.parentCategory;

    newCategory.save(function(err, category){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data:{status : 200}});
        }
    });
});*/


/*
*   This method retrieves all the categories
*/
CategoryRouter.get('/getAllCategories', function(req, res){
    CategoryModel.find({}, function(err, category){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data: {status: 200, category}});
        }
    });
});

/**
 * This method retrieves parent categories list
 */
CategoryRouter.get('/getAllParentCategories', function(req, res){
    CategoryModel.find({}).distinct('parentCategory', function(err, parentCategory){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data: {status: 200, parentCategory}});
        }
    });
});


/*
*   This method retrieves categories based on parent category selected
*/
CategoryRouter.get('/getFilteredCategory/:category', function(req, res){
    CategoryModel.find({parentCategory : req.params.category}, function(err, category){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data: {status: 200, category}});
        }
    });
});


/*
*   This method updates category
*/
/*CategoryRouter.post('/updateCategory', function(req, res){

    var updatedCategory = {};

    if(req.body.categoryName !== ''){
        updatedCategory.categoryName = req.body.categoryName;
    }

    if(req.body.parentCategory !== ''){
        updatedCategory.parentCategory = req.body.parentCategory;
    }

    CategoryModel.update({_id : req.body._id}, {$set : updatedCategory}, function(err, category){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data:{status : 200}});
        }
    })

});*/

/*
*   This method deletes the selected category
*/
/*CategoryRouter.post('/deleteCategory', function(req, res){
    CategoryModel.findByIdAndRemove({_id : req.body._id}, function(err, category){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data:{status : 200}});
        }
    });
});*/

CategoryRouter.get('/applyFilter/:filterValue', function(req, res){
    CategoryModel.find({'categoryName' : new RegExp(req.params.filterValue, 'i')}, function(err, category){
        if(err) {
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data: {status: 200, category}});
        }
    });
})

CategoryMiddleware.use('/category', CategoryRouter);

module.exports = CategoryMiddleware;