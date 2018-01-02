var mongoose = require('mongoose');
var sequenceGenerator = require('mongoose-sequence-plugin');

ProductSchema = mongoose.Schema({
    productId       :   String,
    productName     :   String,
    category        :   {type : mongoose.Schema.Types.ObjectId, ref : 'category'},
    price           :   Number,
    quantity        :   Number,
    description     :   String,
    images          :   [{type : mongoose.Schema.Types.ObjectId, ref : 'image'}],
    highlights      :   [{type : String, ref : 'highlights'}],
    discount        :   Number,
    colorVariants   :   [{type: String, ref : 'colorVariants'}],             // Variants include colors
    additionDate    :   Date,        // This is date on which product has been added
    ratings         :   Number,
    orderRate       :   Number      // This flag marks number of times the product has been ordered. Useful for Popular Products
});

ProductSchema.plugin(sequenceGenerator,{
	field	: 	'productId',
	startAt	:	'001',
	prefix	:	'P-'
});

module.exports = ProductSchema;
