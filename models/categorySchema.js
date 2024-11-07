import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category : {
    type : String,
    required : true
  }
}, {timestamps : true});

const categoryModel = new mongoose.model('category', categorySchema);

export default categoryModel;