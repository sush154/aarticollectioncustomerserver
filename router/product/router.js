var express = require('express'),
    ProductMiddleware = express(),
    ProductRouter = express.Router(),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    ProductModel = require('../../model/product'),
    CategoryModel = require('../../model/category'),
    config = require('../../config')
    ImageModel = require('../../model/image'),
    multer = require('multer')
    fs = require('fs');

ProductRouter.use(cookieParser());
ProductRouter.use(session({ secret: 'secretkey', cookie: { httpOnly: false,secure:false,expires: new Date(Date.now() + (1*24*60*60*1000))}, resave: false, saveUninitialized: true  })); // session secret

ProductRouter.use(function(req, res, next){
    var origin = req.headers.origin;
    if(config.client.connectionUrl.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }

    //res.header("Access-Control-Allow-Origin", config.client.connectionUrl);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    /*if((req.session.cookie._expires > (new Date())) && req.cookies.token){
      next();
    } else {
      res.cookie("token", "", { expires: new Date() });
      return res.json({data: {status : 401}});
    }*/
    next();
});


var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');

/*
*   This method retrieves all products
*/
ProductRouter.get('/getAllProducts', function(req, res){
    ProductModel.find({}).populate('category').select('productId productName category price quantity images').exec(function(err, product){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data: {status: 200, product}});

        }
    });
});

/*
*   This method get total products count available
*/
ProductRouter.get('/getProductsCount', function(req, res){
    ProductModel.count({}, function(err, product){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data: {status: 200, product}});
        }
    });
});

/*
*   This method get product details for selected product
*/
ProductRouter.get('/getProductDetails/:id', function(req, res){
    var productId = req.params.id;

    ProductModel.findOne({productId : productId}).populate('category').exec(function(err, product){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            if(product !== null){
                return res.json({data: {status: 200, product}});
            }else {
                return res.json({data: {status: 200, product : {}}});
            }

        }
    });
});


/*
*   This method adds new product
*/
ProductRouter.post('/addProduct', function(req, res){
    var newProduct = new ProductModel;

    newProduct.productName = req.body.productName;
    newProduct.category = req.body.category;
    newProduct.price = req.body.price;
    newProduct.quantity = req.body.quantity;
    newProduct.description = req.body.description;
    newProduct.discount = 0;
    newProduct.ratings = 0;
    newProduct.additionDate = new Date();

    /*for(let i=0; i< req.body.highlights.length; i++){
        newProduct.highlights.push(req.body.highlights[i]);
    }

    for(let i=0; i< req.body.colorVariants.length; i++){
        newProduct.colorVariants.push(req.body.colorVariants[i]);
    }*/

    newProduct.save(function(err, product){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data: {status: 200, product}});
        }
    });
});


/*
*   This method updates product details
*/
ProductRouter.post('/updateProduct', function(req, res){
    var updatedProduct = {};

    if(req.body.productName !== ''){
        updatedProduct.productName = req.body.productName;
    }

    if(req.body.category !== ''){
        updatedProduct.category = req.body.category;
    }

    if(req.body.price){
        updatedProduct.price = req.body.price;
    }

    if(req.body.quantity){
        updatedProduct.quantity = req.body.quantity;
    }

    if(req.body.description !== ''){
        updatedProduct.description = req.body.description;
    }


    if(req.body.highlights && req.body.highlights.length > 0){
        updatedProduct.highlights = req.body.highlights;
    }

    if(req.body.colorVariants && req.body.colorVariants.length > 0){
        updatedProduct.colorVariants = req.body.colorVariants;
    }

    ProductModel.update({_id : req.body._id}, {$set : updatedProduct}, function(err, doc){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data:{status : 200}});
        }
    });
});

/*
*   This method adds meta information of the product
*/
ProductRouter.post('/addMetaInfo', function(req, res){

    let updatedProduct = {};

    if(req.body.description !== ''){
        updatedProduct.description = req.body.description;
    }

    if(req.body.discount){
        updatedProduct.discount = req.body.discount;
    }


    if(req.body.highlights && req.body.highlights.length > 0){
        updatedProduct.highlights = req.body.highlights;
    }

    if(req.body.colorVariants && req.body.colorVariants.length > 0){
        updatedProduct.colorVariants = req.body.colorVariants;
    }

    ProductModel.update({_id : req.body._id}, {$set : updatedProduct}, function(err, doc){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data:{status : 200}});
        }
    });
});


/*
*   This method deletes the selected product
*/
ProductRouter.post('/deleteProduct', function(req, res){
    ProductModel.findByIdAndRemove({_id : req.body._id}, function(err, product){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data:{status : 200}});
        }
    })
});


/*
*   This method adds discount for selected product
*/
ProductRouter.post('/updateDiscount', function(req, res){
    ProductModel.update({_id : req.body._id}, {$set : {'discount' : req.body.discount}}, function(err, product){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data:{status : 200}});
        }
    });
});


/*
*   This method updates discount for all products
*/
ProductRouter.post('/addDiscountAllProducts', function(req, res){
    ProductModel.update({}, {$set : {'discount' : req.body.discount}},{multi: true}, function(err, product){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data:{status : 200}});
        }
    });
});

/*
*   This method updates discount for category
*/
ProductRouter.post('/addDiscountForCategory', function(req, res){
    ProductModel.update({category : req.body.category}, {$set : {'discount' : req.body.discount}},{multi: true}, function(err, product){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data:{status : 200}});
        }
    });
});

/*
*   This method updates discount for selected Product
*/
ProductRouter.post('/addDiscountSelectedProduct', function(req, res){
    for(let i=0; i < req.body.productIds.length; i++){
        ProductModel.findOne({_id : req.body.productIds[i]}, function(err, product){
            if(err){
                console.log(err);
                return res.json({data:{status : 500}});
            }else {
                ProductModel.update({_id : product._id}, {$set : {'discount' : req.body.discount}}, function(err, updatedProduct){
                    if(err){
                        console.log(err);
                        return res.json({data:{status : 500}});
                    }else {

                    }
                });
            }
        });
    }

    return res.json({data:{status : 200}});
});


/*
*   This method add image urls for the product
*/
ProductRouter.post('/addImage/:productId', function(req, res){
    /*ProductModel.update({_idg : req.body._id}, {'$push' : {'images' : req.body.imaeUrl}}, function(err, product){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data:{status : 200}});
        }
    });*/
    //console.log(req.params.productId);
    upload(req,res,function(err){
        //console.log(req.file);
        if(err){
             return res.json({error_code:1,err_desc:err});

        }else {
            var newImage = new ImageModel;

            newImage.img.data = fs.readFileSync(req.file.path);
            newImage.img.contentType = 'base64';
            newImage.projectId = req.params.productId;

            newImage.save(function(e, image){
                if(e){
                    console.log(e);
                    return res.json({data:{status : 500}});
                }else {
                    fs.unlinkSync(req.file.path);
                    return res.json({data:{status : 200}});

                    /*ProductModel.update({_id : req.params.productId}, {'$push' : {'images' : image._id}}, function(err, product){
                        if(err){
                            console.log(err);
                            return res.json({data:{status : 500}});
                        }else {
                            return res.json({data: {status: 200, product : req.params.productId}});
                            //return res.json({error_code:0,err_desc:null});
                        }
                    });*/
                }
            });
        }

    });
});

/*
*   This method retrieves images list for selected product id
*/
ProductRouter.get('/getImagesList/:productId', function(req, res){
//projectId : req.params.productId
    ImageModel.find({projectId : req.params.productId}, function(err, image){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {

            //res.set('Content-Type', 'image/*');
            res.send(image);
            //return res.json({data: {status: 200, product}});
        }
    })
});

/*
*   This method retrieves products based on the filters
*/
ProductRouter.post('/applyFilter', function(req, res){
    var query = {};

    for(let i = 0; i < req.body.filters.length; i++){
        query[req.body.filters[i].type] = new RegExp(req.body.filters[i].value, 'i');
    }

    ProductModel.find(query).populate('category').select('productId productName category price quantity').exec(function(err, product){
        if(err){
           console.log(err);
           return res.json({data:{status : 500}});
        }else {
           return res.json({data: {status: 200, product}});
        }
    });
});


/*
*   This method applies product name filter
*/
ProductRouter.get('/productNameFilter/:productName', function(req, res){

    ProductModel.find({'productName' : new RegExp(req.params.productName, 'i')}).populate('category').select('productId productName category price images').exec(function(err, product){
        if(err){
            console.log(err);
            return res.json({data:{status : 500}});
        }else {
            return res.json({data: {status: 200, product}});

        }
    });
});

ProductMiddleware.use('/product', ProductRouter);

module.exports = ProductMiddleware;

