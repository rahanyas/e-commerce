import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName : {
      type : String,
      required : true,
      validate : {
        validator : (v) => {
          return /^[a-zA-Z\s]+$/.test(v);
        },
        message : props => `${props.value} is not a valid name! Name should contain only letters and spaces.`
      }
    },
    email : {
      type : String,
      required : true,
      unique : true,
      validate : {
        validator : (v) => {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(v)
        },
        message : props => `${props.value} is not a valid email!`
      }
    },
    mobile : {
      type : String,
      required : true,
      unique : true,
      validate  : {
        validator : (v) => {
          return /^[0-9]{10}$/.test(v);
        },
        message: props => `${props.value} is not a valid mobile number! Mobile should be a 10-digit number.`
      }
    },
    password : {
      type : String,
      required : true,
      minlength : 8,
    },
    zip : {
      type : Number,
    },
    address : {
      type : String
    },
    isActive : {
      type : Boolean,
      default : true
    }
},{
  timestamps : true
})

const User = mongoose.model("User", userSchema);

export default User