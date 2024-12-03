import mongoose, { Schema } from "mongoose";

const banerSchema = new mongoose.Schema({
   images : [{
    public_id : {
      type : String
    },
    url : {
      type : String
    }
   }],
   titleOne : {
    type : String
   },
   titleTwo : {
    type : String
   },
   titleThree : {
    type : String
   },
   isActive : {
    type : Boolean,
    default : true
   }
}, {timestamps : true});

const banerModel = new mongoose.model('Baner', banerSchema);

export default banerModel;