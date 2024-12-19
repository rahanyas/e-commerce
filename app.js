import express from 'express';           
import dotenv from 'dotenv';              
import connectDB from './config/db.js';    
import session from 'express-session'; 
import cloudinary from 'cloudinary';  
import morgan from 'morgan';
import cors from 'cors'
import Stripe from 'stripe'

const app = express();

dotenv.config();
connectDB();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
export {stripe};

cloudinary.v2.config({
  cloud_name : process.env.CLOUDINARY_NAME,
  api_key : process.env.CLOUDINARY_APIKEY,
  api_secret : process.env.CLOUDINARY_SECRET
})



app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(morgan('tiny'));
app.use(cors())


app.use(session({
  secret:'123455678',
  saveUninitialized: true,
  resave: true
}));

import router from './router/userRoutes.js'; 
import adminrouter from './router/adminRoutes.js';
import productRouter from './router/productRoutes.js'


app.use('/', router);
app.use('/', adminrouter);
app.use('/', productRouter);

app.listen(process.env.PORT || 9000, '0.0.0.0',() => {
  console.log(`server is running on port ${process.env.PORT || 9000}`)
})