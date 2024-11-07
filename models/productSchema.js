import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  brand : {
    type : String,
    required : true, 
  },
  name : {
    type : String,
    required : true
  },
  description : {
    type : String
  },
  price : {
    type : Number,
    required : true,
  },
  offerPrice : {
    type : Number
  },
  images : [
 {
  public_id : {
    type : String
  },
  url : {
    type : String
  }
 }
  ],
  category : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'category',
  },
  stock : {
    type : Number,
    required : true
  },
  color : [{
    type : String,
    required : true
  }],
  size :[
    {
      type : String,
      required : true
    }
  ]
}, {timestamps : true} );

const Products = new mongoose.model('product', productSchema);

export default Products;