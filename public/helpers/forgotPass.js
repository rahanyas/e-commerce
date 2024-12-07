import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../../models/userModels.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';

const forgotPassPage = (req, res) => {
  try {
    res.render('userPages/forgotPassPage')
  } catch (err) {
    console.log('error', err);
    return res.status(500).send({
      msg : 'an error occured in forgot pass page'
    })
  }
};

const sendingOtp = async(req, res) => {
  try {
    const { email }  = req.body;
    console.log(email);
    
    const transporter = nodemailer.createTransport({
       service : 'gmail',
       auth : {
        user : process.env.NODEMAIL_MAIL,
        pass : process.env.NODEMAIL_PASSWORD
       }
    });
    
    const otp = crypto.randomInt(100000, 999999).toString();

    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    let user = await User.findOne({ email});
    console.log(user);
    if(!user){
      return res.send({
        msg : 'user is not while sending otp'
      })
    }
    
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await transporter.sendMail({
      from : process.env.NODEMAIL_MAIL,
      to : email,
      subject : 'your otp code ',
      text : `your otp code is ${otp}. it will expire in 5 minutes`
    })
    
    console.log('otp send successfully')

    res.render('userPages/enterOtpPage', {
      email
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      msg : 'an error occured in sending otp'
    })
  }
};

const validateOtp = async (req, res) => {
  try {
    const {email, otp} = req.body;

    console.log(email);
    console.log(otp);

    const user = await User.findOne({email});
    console.log(user);

    console.log('stored otp : ',user.otp);
    console.log('otp provided :', otp);
    const string_otp = otp.join('');
    console.log(string_otp);

    if(user.otp !== string_otp || user.otpExpires < Date.now()){
      return res.status(400).send({
        msg : 'invlaid or expired otp'
      })
    };

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.render('userPages/newPassPage', {
      email
    });

  } catch (err) {
    console.log('error', err);
    return res.status(500).send({
      msg : 'an error occured in validate otp'
    })
  }
};

const settingNewPass = async (req, res) => {
  try {
    const {email} = req.body;
    console.log(email);

    const user = await User.findOne({email});
    if(!user){
      return res.status(400).send({
        msg : 'no user found'
      })
    }
    console.log(user);
  } catch (err) {
    console.log('error', err);
    return res.status(500).send({
      msg : 'error occured while setting new password'
    })
  }
}

export {
    forgotPassPage,
    sendingOtp,
    validateOtp,
    settingNewPass
}