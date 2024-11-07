import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  userName : {
    type : String,
    reqiured : true
  },
  password : {
    type : String,
    required : true
  }
});

const Admin = new mongoose.model("Admin", adminSchema);

export default Admin;