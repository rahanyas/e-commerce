import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema({
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },
  items : [
    {
      products : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'product',
        required : true
      }
    }
  ]
}, {timestamps : true});

const wishListModel = new mongoose.model('wishList', wishListSchema);

export default wishListModel;

