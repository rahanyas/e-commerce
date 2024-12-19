import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required : true
  },
  address : {
     type : String,
     required : true
  },
  items : [
    {
      products : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'product',
        required : true
      },
      price : {
        type : Number,
        required : true
      },
      quantity : {
        type : Number,
        required : true
      },
      subtotal : {
        type : Number,
        required : true
      },
      paymentMethod : {
        method : {
         type : String,
         enum : ['stripe', 'cod'],
         required : true
        },
       transactionId : {
         type : String,
       },
     }
    }
  ],
  totalPrice : {
    type : Number,
    required : true
  },
  status : {
    type : String,
    enum : ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default : 'Pending'
  },
  orderDate : {
    type : Date,
    default : Date.now
  },
},{timestamps : true });

const orderModel = new mongoose.model('Order', orderSchema);

export default orderModel;