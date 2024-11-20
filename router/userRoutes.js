
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
  } from "../controllers/userController/users.js";
// import verifyUser from "../middlewares/login.js";

router.get('/',homePage);
router.get('/login', loginPage);
router.post('/signup', signup)
router.post('/loginAuth', loginAuth);
router.get('/logout', logout);

router.get('/contact', contactPage);

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

router.get('/payment', orderPage);
router.post('/create-checkout-session', stripePay);
router.get('/success', orderSuccess);

export default router;