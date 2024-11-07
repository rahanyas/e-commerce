
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required :true
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
        ref : 'product',
        required : true
      },
      quantity : {
        type : Number,
        required : true,
        min : 1,
        default : 1
      },
      color : {
        type : String,
        required : true
      }, 
      subTotal : {
        type : Number,
        required : true
      }
    }
  ],
   totalPrice : {
    type : Number,
    required : true
   },
},{timestamps : true});

const Cart = new mongoose.model('Cart', cartSchema);

export default Cart;