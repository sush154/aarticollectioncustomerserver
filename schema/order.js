
var mongoose = require('mongoose');
var sequenceGenerator = require('mongoose-sequence-plugin');

var OrderSchema = mongoose.Schema({
    orderId         :   String,
    orderDate       :   Date,
    customer        :   {type : mongoose.Schema.Types.ObjectId, ref : 'customer'},
    paymentType     :   String,         // Cash(0), Online(1), Cheque(2)
    deliveryDate    :   Date,
    orderStatus     :   String,         // New(0), Pending(1), Shipped(2), Complete(3), Cancelled(4), Pick Up(5)
    amount          :   Number,         // This is final ampunt of the ordr. It would be calculated based on total price, GST and discount
    paymentAmount   :   Number,         // This amount will be amount paid by customer
    products        :   [{type : mongoose.Schema.Types.ObjectId, ref : 'orderProduct'}],
    courier         :   {type : mongoose.Schema.Types.ObjectId , ref : 'courier'},
    paymentStatus   :   String,         // Awaiting payment(0), Partially Paid(1), Paid(2), Cancelled(3), Returned(4)
    orderType       :   String,          // Online(0), On Call(1), Home Shopping(3)
    deliveryType    :   String,           // Pick Up(0), Couriered(1)
    transactTrackId :   String,          //  Tracking ID to be provided for the transaction if the type has been selected as Online or Cheque
    deliveryTrackId :   String
});

OrderSchema.plugin(sequenceGenerator, {
   field    :   'orderId',
   startAt  :   '001',
   prefix   :   'O-'
});

module.exports = OrderSchema;