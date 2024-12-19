import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code : {
    type : String,
    unique : true,
    required : true,
    trim : true
  },
  description : {
    type : String,
    required : true,
    trim : true
  },
  discount : {
    type : Number,
    required : true,
    min : 0,
    max : 100
  },
  isActive : {
    type : Boolean,
    default : true,
  },
  minimumPurchase : {
    type : Number,
    required : true,
    min : 100,
    max : 5000
  }
}, {timestamps : true});

const Coupon = new mongoose.model('coupon', couponSchema);

export default Coupon;