
import express from "express";
const router = express.Router()
import { loginAuth,
         loginPage,
         homePage,
         logout,
         productPage,
         productDetailsPage,
         contactPage,
         signup, 
         myProfile, 
         addAddress,
         addToCartAuth,
         CartPage,
         removeCartItem,
         addToWishList,
         wishListPage,
         removeWishListproduct,
         orderPage,
         stripePay,
         quantityChange,
         productSearch,
         orderSuccess,
         userInfoPage,
         orderCancel,
         cod_purchase,
         getOrderDates,
         getOrderDetailsByDate,
         contactUs,
  } from "../controllers/userController/users.js";

import { 
       forgotPassPage, 
       sendingOtp,
       settingNewPass,
       validateOtp
    } from "../public/helpers/forgotPass.js";
// import verifyUser from "../middlewares/login.js";

router.get('/',homePage);
router.get('/login', loginPage);
router.post('/signup', signup)
router.post('/loginAuth', loginAuth);
router.get('/logout', logout);

router.get('/contact', contactPage);
router.post('/contactUs', contactUs);

router.get('/product', productPage);
router.get('/productDetail/:id', productDetailsPage);
router.get('/shoping-cart', CartPage);
router.get('/deleteCartItem/:id', removeCartItem);
router.post('/addtoCart/:id', addToCartAuth);
router.post('/cart/update-quantity', quantityChange);
router.get('/search', productSearch)

router.post('/addtoWishList/:id', addToWishList);
router.get('/wishlistPage', wishListPage);
router.post('/removeItem/:id', removeWishListproduct);

router.get('/profile', myProfile);
router.get('/userInfo', userInfoPage)
router.post('/addAddress/:id', addAddress);

router.get('/ordersDate', getOrderDates);
router.get('/viewDetails', getOrderDetailsByDate)

router.get('/payment', orderPage);
router.post('/create-checkout-session', stripePay);
router.get('/success', orderSuccess);
router.get('/cancel', orderCancel);
router.post('/cod-order',cod_purchase);

//for forgot pw
router.get('/forgotPass', forgotPassPage);
router.post('/Email', sendingOtp);
router.post('/verifyOtp', validateOtp);
router.post('/reset-password', settingNewPass);

export default router;
