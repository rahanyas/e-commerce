import User from "../../models/userModels.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import Products from '../../models/productSchema.js'
import Cart from "../../models/cartSchema.js";
import wishListModel from "../../models/wishListSchema.js";
import orderModel from "../../models/orderSchema.js";
import { stripe } from "../../app.js";
import banerModel from "../../models/banerSchema.js";
import moment from "moment";
import nodemailer from 'nodemailer';
import Coupon from "../../models/couponSchema.js";

const homePage = async (req, res) => {
  const products = await Products.find({}).populate('category');
  const banners = await banerModel.find();
  const user = req.session.user
 if(!user){
  return res.render('userPages/index', {
    success : null,
    error : null,
    products,
    banners
  })
 }
     return res.render('userPages/index', {
      success : null,
      error : null,
      user,
      products,
      banners
    })
};

const loginPage =  (req, res) => {
  if(req.session.user){
    return res.render('userPages/login-page', {
      success : 'you are already logged in',
      error : null
    })
  }
  return res.render('userPages/login-page', {
   success : null,
   error : null
  })
};

const signup = async (req, res) => {
   const {fullName, email, password, mobile} = req.body;
   try{
      
       const userExists = await User.findOne({email});
         if(userExists){
          return res.render('userPages/login-page', {
            error : 'user already exists',
            success : null,
          });
         }else{
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new User({
            fullName,
            email,
            password : hashedPassword,
            mobile
          });
    
          await newUser.save();
          req.session.userId = newUser._id;
          req.session.user = {
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            mobile: newUser.mobile
          };
          const products = await Products.find({}).populate('category');
          const banners = await banerModel.find();
          return res.render('userPages/index', {
            success : `welcome ${newUser.fullName}`,
            error : null,
            user : req.session.user,
            products,
            banners 
          });
         }
        } catch (error) {
          console.error(error);
          return res.render('userPages/login-page', {
            error : 'an error occured',
            success : null
          })
  }     
};
 
        
    
const loginAuth = async (req, res) => {
     const {email, password} = req.body;
     
     try {
      const user = await User.findOne({email});

      if(!user){
        return res.render('userPages/login-page', {
          error : 'invalid credentials',
          success : null
        });
      }
        
     const isMatch = await bcrypt.compare(password, user.password);

     if(isMatch){
      req.session.user = {
        _id : user._id,
        fullName : user.fullName,
        email : user.email,
        mobile : user.mobile,
        zip : user.zip,
        address : user.address
       }
       const products = await Products.find({}).populate('category');
       const banners = await banerModel.find();
       return res.render('userPages/index', {
        success : `welcome ${user.fullName}`,
        error : null,
        user : req.session.user,
        products ,
        banners
      });
     }else{
     
      return res.render('userPages/login-page', {
        error : 'invalid credentials',
        success : null,
        
      });
     }

     } catch (error) {
        console.error(error)
     }
}
 

const myProfile = (req, res) => {
   try {
      return  res.render('userPages/myAccount', {
          user : req.session.user || null,
          error : null,
          success : null
        })
   } catch (error) {
    console.error(error);
    return res.render('userPages/myAccount', {
      user : null,
      error : 'an error occured',
      success : null
    });
   }
};

const userInfoPage = (req, res) => {
  try {
    return  res.render('userPages/userDetailsPage', {
        user : req.session.user || null,
        error : null,
        success : null
      })
 } catch (error) {
  console.error(error);
  return res.render('userPages/userDetailsPage', {
    user : null,
    error : 'an error occured',
    success : null
  });
 }
}

const addAddress = async (req, res) => {     
     try {
      const {zip, address, fullName, email, mobile} = req.body;
      // const user = await User.findOne({zip});
      const userId = req.params.id;
      const user = await User.findById(userId);
      if(!user) {
        res.render('userPages/userDetailsPage', {
          user : null,
          error : 'user is not found',
          success : null
        })
      }
      // console.log(userId);
       const updateAdd = await User.findByIdAndUpdate(userId, {
        $set : {
          zip,
          address,
          mobile,
          fullName,
          email
        }
       }, {new : true})
       req.session.user = {
        _id : updateAdd._id,
        fullName : updateAdd.fullName,
        email : updateAdd.email,
        mobile : updateAdd.mobile,
        zip : updateAdd.zip,
        address : updateAdd.address
       }
      //  const products = await Products.find({}).populate('category');
       if(updateAdd){
         res.render('userPages/userDetailsPage', {
          user : req.session.user || null,
          success : ' details added  successfuly',
          error : null
        })

      // if(updateAdd){

      //      return res.render('userPages/index', {
      //       user,
      //       ifLogedIn,
      //       products,
      //       success : null,
      //       error : null,
      //      })
      
        // const user = req.session.user;
        // console.log(user);
        // console.log('updated')
      }else{
        return res.render('userPages/userDetailsPage', {
          user : req.session.user || null,
          error : 'updation failed',
          success : null,
         })
      }
   }catch (error) {
      console.error(error);
      res.render('userPages/userDetailsPage', {
        user : req.session.user,
        error : 'an error occured while updating address',
        success : null
      })
     }
}


const productPage = async (req, res) => {
  const user = req.session.user;
  const products = await Products.find({}).populate('category');
  res.render('userPages/product', {
    user,
    products,
    error : null,
    success : null
    })
};

const productDetailsPage = async (req, res) => {
  try {
    const user = req.session.user
    const productId = req.params.id;
    const product = await Products.findById(productId)
    // console.log(product)
    res.render('userPages/productDetails',{
      product,
      user
    }
    )
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message : 'error in productDetailsPage',
      success : false
    })
  }
}



const addToCartAuth = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) {
      return res.send({
        msg: 'User not found, please log in'
      });
    }

    const userDetail = await User.findOne(user);
    const productId = req.params.id;
    const selectedColor = req.body.color;
    console.log(selectedColor)

    if (!productId) {
      return res.send({
        success: false,
        msg: 'Product not found'
      });
    }

    const product = await Products.findById(productId);

    if (!product) {
      return res.send({
        success: false,
        msg: 'Product not found in database'
      });
    }

    let cart = await Cart.findOne({ user: userDetail._id });

    if (cart) {

      let existingProduct = cart.items.find(item => {
        return item.products.toString() === product._id.toString();
      })

      if(!existingProduct){
        cart.items.push({
          products: product._id,
          price: product.price,
          quantity: 1,
          color : selectedColor ,
          subTotal: product.price * 1
        });
        cart.totalPrice += product.price;
        
        await cart.save();
        res.send({
          msg: 'Product added to the cart'
        });
      }else{
        return res.send({
          msg : 'product is already in the cart'
        })
      }
    } else {
          const new_cart = new Cart({
          user: userDetail._id,
          items: [
            {
              products: product._id,
              price: product.price,
              quantity: 1,
              color : selectedColor ,
              subTotal: product.price * 1
            }
          ],
          totalPrice: product.price 
        });
  
        await new_cart.save();
        return res.send({
          success: true,
          msg: 'New cart created and product added to the cart'
        });
      }
    } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      msg: 'An error occurred in add to cart auth'
    });
  }
};


// const CartPage = async (req, res) => {
//   try {
//     const user = req.session.user;
//      if(!user){
//       return res.render('userPages/login-page', {
//         success : null,
//         error : 'please login to see your cart'
//       })
//      }
//      const userDetail = await User.findById(user._id);

     
//      const cart = await Cart.findOne({user : userDetail._id}).populate('items.products');

//      if(!cart || !cart.items || cart.items.length === 0){

//        const products = await Products.find({}).populate('category');
//        return res.render('userPages/product', {
//          user,
//          products,
//          error : 'you are not added any products to cart',
//          success : null
//         })
//       };

//       const productIds = cart.items.map(item => item.products);
//       const products = await Products.find({_id : {$in : productIds}});
     
//       console.log(userDetail, cart)

//      return res.render('userPages/shoping-cart', {
//        products,
//        cart
//      })
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({
//       success : false,
//       message : 'error in cart page'
//     })
//   }
// }

const CartPage = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) {
      return res.render('userPages/login-page', {
        success: null,
        error: 'Please login to see your cart'
      });
    }

    const userDetail = await User.findById(user._id);
    const cart = await Cart.findOne({ user: userDetail._id }).populate('items.products');

    if (!cart || !cart.items || cart.items.length === 0) {
      const products = await Products.find({}).populate('category');
      return res.render('userPages/product', {
        user,
        products,
        error: 'You have not added any products to your cart',
        success: null
      });
    };
    console.log(cart.totalPrice)



    return res.render('userPages/shoping-cart', {
      products: cart.items,
      totalPrice: cart.totalPrice,  // Pass total price
      cart
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: 'Error loading the cart page'
    });
  }
};

const quantityChange = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.session.user._id;
   
  try {
     
    if(!userId){
      return res.send({
        msg : 'user is not found pls login'
      })
    }

      const cart = await Cart.findOne({ user: userId, "items.products": productId });

      if (!cart) {
          return res.status(404).json({ success: false, message: 'Cart not found' });
      }

      // Find the specific item to update
      const itemIndex = cart.items.findIndex(item => item.products.toString() === productId);
      if (itemIndex === -1) {
          return res.status(404).json({ success: false, message: 'Product not found in cart' });
      }

      // Update the quantity
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].subTotal = cart.items[itemIndex].price * quantity;

      // Update the cart in the database
      const totalPrice = cart.items.reduce((total, item) => total + item.subTotal, 0);
      cart.totalPrice = totalPrice;
      await cart.save();


      res.json({
          success: true,
          message: 'Quantity updated successfully',
          itemSubtotal: cart.items[itemIndex].subTotal,
          totalPrice: totalPrice
      });
  } catch (error) {
      console.error('Error updating quantity:', error);
      res.status(500).json({ success: false, message: 'Error updating quantity' });
  }
};


const removeCartItem = async (req, res) => {
   try {
    const user = req.session.user;
    const productId = req.params.id;

    const userDetail = await User.findOne(user);
    const cart = await Cart.findOne({user : userDetail._id});

    const product = cart.items.find(item => item.products.toString() === productId);
   
    if(!product){
      res.status(400).send({
        success : false,
        message : 'product is not found'
      })
    };

    cart.items = cart.items.filter(item => item.products.toString() !== productId);
    
    if (cart.items.length > 0) {
      cart.totalPrice = cart.items.reduce((total, item) => total + item.subTotal, 0);
    } else {
      cart.totalPrice = 0;
    }
    await cart.save();

    // console.log(userDetail, productId, cart, product,);
    return res.status(200).send({
      message : 'product is removed'
    })

   } catch (err) {
    console.error(err);
    res.status(500).send({
      success : false,
      message : 'error in remove cart item'
    })
   }
}

const addToWishList = async (req, res) => {

  try {
    const productId = req.params.id;
    const user = req.session.user;
    const products = await Products.find({}).populate('category');
    if(!user){
      return res.status(200).send({
        message : 'pls login'
      })
    }
      console.log(productId);
 
      const product = await Products.findOne({_id : productId});
      const userDetail = await User.findOne({_id : user._id})
     
      const userWishList = await wishListModel.findOne({user : userDetail._id});
      console.log(product, userDetail, userWishList);
      
      if(userWishList){
         const existingProduct = userWishList.items.find((item) => 
           item.products.toString() === product._id.toString()
          );
  
          if(!existingProduct){
            userWishList.items.push({products : product._id});
            await userWishList.save();
            return res.render('userPages/product', {
                products,
                success : 'products is added to wishlist',
                error : null
            })
          }else{
            return res.status(400).send({
              success : true,
              message : 'product is already in wishlist'
            })
          }
      }else{
        const new_WishList = new wishListModel({
          user : userDetail._id,
          items : [{products : product._id}]
        });
        await new_WishList.save();
        if(new_WishList){
          res.status(200).send({
            success : true,
            message : 'new wishlist and product added to wishlist'
          })
        }
      }
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success : false,
      message : 'an error occurred in add to wishlist'
    })
  }
}

const wishListPage = async (req, res) => {
  // res.render('userPages/wishlistPage');
  try {
    
    const user = req.session.user;

    if(!user){
      return res.render('userPages/login-page', {
        error : 'pls loggin to see the wishlist',
        success : null
      })
    };
    
    const userDetail = await User.findOne(user);
    const userWishList = await wishListModel.findOne({user : userDetail._id}).populate('items.products')
    // if(!userWishList){
    //   return res.status(400).send({
    //     success : false,
    //     message : 'no wishlist for this user'
    //   })
    // };
    
    if(!userWishList || !userWishList.items || userWishList.items.length === 0){
      const products = await Products.find({}).populate('category');
        return res.render('userPages/product', {
          user,
          products,
          error : 'you are not added any products to wishlist',
          success : null
        })
    };

    const productIds = userWishList.items.map(item => item.products);
    const products = await Products.find({_id : {$in : productIds}});
    return res.render('userPages/wishlistPage', {
      user,
      products
    })
    // console.log(userDetail, userWishList, products)
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success : false,
      message : 'an error occured in wishlist page'
    })
  }
}

const removeWishListproduct = async (req, res) => {
     try {
      
      const user = req.session.user;
      if(!user){
         return console.log('no user is found pls login')
      };
      const userDetail = await User.findOne(user);

      const productId = req.params.id;
      if(!productId){
        return console.log('got no product');
      };
      const userWishList = await wishListModel.findOne({user : userDetail._id});
      if(!userWishList){
        return console.log('user has no wish list');
      };

      const product = userWishList.items.find((item) => {
        return item.products.toString() === productId;
      });

      if(!product){
        return console.log('cant find the product')
      };

      userWishList.items = userWishList.items.filter((item) => {
        return item.products.toString() !== productId
      });
      await userWishList.save();
      // console.log(productId, userDetail, userWishList);
      return console.log('product is removed');

     } catch (err) {
      console.error(err);
      res.status(500).send({
        success : false,
        message : 'error in remove wishList product'
      })
     }
};

const orderPage = async (req, res) => {
  try {
    
    const user = req.session.user;
    !user ? console.log('pls login'): console.log(user);
    console.log(req.body);
    
    const cart = await Cart.findOne({user : user._id}).populate('items.products');
    !cart ? console.log('user has no cart'):console.log(cart);
    const coupons = await Coupon.find({minimumPurchase : {$lte : cart.totalPrice}});
    console.log(coupons);
    
    const totalPrice = cart.totalPrice
    return res.render('userPages/orderPage', {
      user,
      cart : cart.items,
      totalPrice,
      stripeKey : process.env.STRIPE_PUBLISHABLE_KEY,
      coupons
    });

    //  console.log( process.env.STRIPE_PUBLISHABLE_KEY)
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      msg : 'an error occrured while getting the orderPage'
    })
  }
};



const stripePay = async (req, res) => {
      try {

        console.log('Create Checkout Session Request Received');
        const user = req.session.user;
        !user ? console.log('pls login'):console.log(user);

        const {couponCode } = req.body;
        console.log('this is coupon code : ', couponCode);

        const selectedCoupon = await Coupon.aggregate([{$match : {
          code : couponCode
        }}, {
          $project : {
            discount : 1,
            _id : 0
          }
        }]);

        console.log(selectedCoupon);
       const coupon = selectedCoupon[0];
        const discountMultiplier = coupon ? (1 -coupon.discount / 100) : 1;

        const cart = await Cart.findOne({user : user._id}).populate('items.products').exec();
         console.log('this is cart : ' , cart);

        if(!cart || cart.items.length === 0){
           return res.send({
            msg : 'your cart is empty'
           })
        };


        const lineItems = cart.items.map(item => ({
          price_data : {
            currency : 'usd',
            product_data : {
              name : item.products.name,
            },
            unit_amount : Math.round(item.products.price * 100 * discountMultiplier),
          },
          quantity : item.quantity,
        }));
        console.log('this is lineitems : ', lineItems);

        
        // if(!process.env.DOMAIN || !process.env.DOMAIN.startsWith('https://')){
        //   throw new Error('invalid domain')
        // }
        //  console.log(process.env.DOMAIN);
         
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `${process.env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}&code=${couponCode}`,
          cancel_url: `${process.env.DOMAIN}/cancel`,
        });
        

        return res.json({
          id : session.id
        });


      } catch (error) {
         console.log(error);
         return res.json({
          msg : 'an error occured in stripe pay auth'
         })
      }
}


// const orderSuccess = async (req, res) => {
//   try {
//     const user = req.session.user;

//     if (!user) {
//       return res.status(401).send({ msg: 'Please login first.' });
//     }

//     const sessionId = req.query.session_id;

//     if (!sessionId) {
//       return res.status(400).send({ msg: 'Invalid session ID.' });
//     }

//     const session = await stripe.checkout.sessions.retrieve(sessionId);
//     if (session.payment_status !== 'paid') {
//       return res.status(400).send({ msg: 'Payment not completed.' });
//     }

//     const cart = await Cart.findOne({ user: user._id }).populate('items.products').exec();
//     if (!cart || cart.items.length === 0) {
//       return res.status(400).send({ msg: 'Your cart is empty.' });
//     }

//     const stripeOrderItems = cart.items.map(item => ({
//       products: item.products._id,
//       price: item.products.price,
//       quantity: item.quantity,
//       subtotal: item.products.price * item.quantity,
//       paymentMethod: {
//         method : 'stripe',
//         transactionId : session.id
//       }, // Assign Stripe for these items
//     }));

 

//     let order = await orderModel.findOne({ user: user._id });

//     if (order) {
//       // Append Stripe items to the existing order
//       order.items = [...order.items, ...stripeOrderItems];
//       order.totalPrice += cart.totalPrice;
//       if (session) {
//         order.paymentMethod = {
//           method: 'stripe',
//           transactionId: session.id,
//         };
//       } else {
//         order.paymentMethod = { method: 'cod' };
//       }
//     } else {
//       // Create a new order
//        order = new orderModel({
//         user: user._id,
//         address: user.address,
//         items: stripeOrderItems, // Or codOrderItems depending on the flow
//         totalPrice: cart.totalPrice,
//         paymentMethod: session
//           ? { method: 'stripe', transactionId: session.id }
//           : { method: 'cod' },
//       });
//     }

//     await order.save();

//     // Clear the user's cart
//     cart.items = [];
//     cart.totalPrice = 0;
//     await cart.save();
     
//     const products = await Products.find({}).populate('category');
//     const banners = await banerModel.find();
//     res.render('userPages/index', {
//       success: 'Your order has been placed successfully via Stripe.',
//       error: null,
//       products,
//       banners
//     });
//   } catch (error) {
//     console.error('Error processing order:', error);
//     res.status(500).send({ msg: 'Something went wrong. Please try again later.' });
//   }
// };


const orderSuccess = async (req, res) => {
  try {
    const user = req.session.user;
 
    if (!user) {
      return res.status(401).send({ msg: 'Please login first.' });
    }
    const couponCode = req.query.code;
    console.log(couponCode)

    const sessionId = req.query.session_id;
  
    if (!sessionId) {
      return res.status(400).send({ msg: 'Invalid session ID.' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return res.status(400).send({ msg: 'Payment not completed.' });
    }

    const cart = await Cart.findOne({ user: user._id }).populate('items.products').exec();
    if (!cart || cart.items.length === 0) {
      return res.status(400).send({ msg: 'Your cart is empty.' });
    }
    const today = moment().startOf('day');
    const endOfDay = moment(today).endOf('day');

    const stripeOrderItems = cart.items.map(item => ({
      products: item.products._id,
      price: item.products.price,
      quantity: item.quantity,
      subtotal: item.products.price * item.quantity,// Assign Stripe for these items
      paymentMethod: {
        method : 'stripe',
        transactionId : session.id
      }, 
    }));
    let order = await orderModel.findOne({
      userId: user._id,
      orderDate: { $gte: today.toDate(), $lte: endOfDay.toDate() },
    });

    let discount = 0;
    if(couponCode){
      const coupon = await Coupon.findOne({code : couponCode});
      if(coupon && coupon.isActive){
        discount = coupon.discount;
      }      // console.log(coupon)
    }

    const cartTotal = cart.totalPrice;
    const discountedTotal = cartTotal * (1- discount / 100);
    

    if (order) {
      // Append Stripe items to the existing order
      order.items = [...order.items, ...stripeOrderItems];
      // const discountMultiplier = couponcode ? (1 -coupon.discount / 100) : 1;
      order.totalPrice = discountedTotal;
      if (session) {
        order.paymentMethod = {
          method: 'stripe',
          transactionId: session.id,
        };
      } else {
        order.paymentMethod = { method: 'cod' };
      }
    } else {
      // Create a new order
       order = new orderModel({
        user: user._id,
        address: user.address,
        items: stripeOrderItems, // Or codOrderItems depending on the flow,
        totalPrice: discountedTotal,
        paymentMethod: session
          ? { method: 'stripe', transactionId: session.id }
          : { method: 'cod' },
        orderDate : today.toDate(),
      });
    }

    await order.save();

    // Clear the user's cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
     
    const products = await Products.find({}).populate('category');
    const banners = await banerModel.find();
    res.render('userPages/index', {
      success: 'Your order has been placed successfully via Stripe.',
      error: null,
      products,
      banners
    });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).send({ msg: 'Something went wrong. Please try again later.' });
  }
};




const orderCancel = async (req, res) => {
  try {    
    const user = req.session.user;
    !user ? console.log('pls login'): console.log(user);
    
    const cart = await Cart.findOne({user : user._id}).populate('items.products');
    !cart ? console.log('user has no cart'):console.log(cart);
    
    const totalPrice = cart.totalPrice
    return res.render('userPages/orderPage', {
      user,
      cart : cart.items,
      totalPrice,
      stripeKey : process.env.STRIPE_PUBLISHABLE_KEY
    })
    //  console.log( process.env.STRIPE_PUBLISHABLE_KEY)
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      msg : 'an error occrured while getting the orderPage'
    })
  }
}

// const cod_purchase = async (req, res) => {
//   try {
//     const user = req.session.user;
//     if (!user) {
//       return res.status(401).send({ msg: 'Please log in to continue.' });
//     }

//     const cart = await Cart.findOne({ user: user._id }).populate('items.products').exec();
//     if (!cart || cart.items.length === 0) {
//       return res.status(400).send({ msg: 'Your cart is empty. Please add items to proceed.' });
//     }

//     const today = moment().startOf('day');
//     const endOfDay = moment(today).endOf('day');

//     const codOrderItems = cart.items.map(item => ({
//       products: item.products._id,
//       price: item.products.price,
//       quantity: item.quantity,
//       subtotal: item.products.price * item.quantity,
//       paymentMethod: {
//         method : 'cod'
//       }
//     }));

//     let order = await orderModel.findOne({
//       userId: user._id,
//       orderDate: { $gte: today.toDate(), $lte: endOfDay.toDate() },
//     });

//     if (order) {
//       // Append COD items to the existing order
//       order.items = [...order.items, ...codOrderItems];
//       order.totalPrice += cart.totalPrice;
//       order.paymentMethod = order.paymentMethod || {}; // Initialize if undefined
//       order.paymentMethod.method = 'cod';
//     } else {
//       // Create a new order
//       order = new orderModel({
//         user: user._id,
//         address: user.address,
//         items: codOrderItems,
//         totalPrice: cart.totalPrice,
//         paymentMethod: { method: 'cod' },        
//         orderDate : today.toDate(),
//       });
//     }

//     await order.save();

//     // Clear the user's cart
//     cart.items = [];
//     cart.totalPrice = 0;
//     await cart.save();

//     const products = await Products.find({}).populate('category');
//     const banners = await banerModel.find()
//     res.render('userPages/index', {
//       success: 'Your order has been placed successfully via Cash on Delivery.',
//       error: null,
//       products,
//       banners
//     });
//   } catch (error) {
//     console.error('Error in COD purchase:', error);
//     res.status(500).send({
//       msg: 'An error occurred while processing your COD order. Please try again later.',
//     });
//   }
// };

// const allOrderDetails = async (req, res) => {
//   try {
//     const user = req.session.user;
//     if (!user) {
//       return res.render('userPages/login-page', {
//         success: null,
//         error: 'Please login to see your cart'
//       });
//     }

//     const order = await orderModel.findOne({user : user._id}).populate('items.products');

//     !order?console.log('user has not placed any order'):console.log(order);

//     res.render('userPages/allOrderView', {
//       order,
//       user
//     });
//   } catch (error) {
//     return res.status(500).send({
//       msg : 'error occured in orderdetails'
//     })
//   }
// }

const cod_purchase = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) {
      return res.status(401).send({ msg: 'Please log in to continue.' });
    }

    const cart = await Cart.findOne({ user: user._id }).populate('items.products').exec();
    if (!cart || cart.items.length === 0) {
      return res.status(400).send({ msg: 'Your cart is empty. Please add items to proceed.' });
    }

    const today = moment().startOf('day');
    const endOfDay = moment(today).endOf('day');

    const codOrderItems = cart.items.map(item => ({
      products: item.products._id,
      price: item.products.price,
      quantity: item.quantity,
      subtotal: item.products.price * item.quantity,
      paymentMethod: { method: 'cod' }, // Ensure this field is set for every item
    }));

    let order = await orderModel.findOne({
      userId: user._id,
      orderDate: { $gte: today.toDate(), $lte: endOfDay.toDate() },
    });

    if (order) {
      // Append COD items to the existing order, ensuring paymentMethod is preserved
      const updatedItems = codOrderItems.map(item => ({
        ...item,
        paymentMethod: { method: 'cod' }, // Ensure this field is present
      }));
      order.items = order.items || [];
      order.items = [...order.items, ...updatedItems];
      order.totalPrice += cart.totalPrice;
    } else {
      // Create a new order
      order = new orderModel({
        user: user._id,
        address: user.address,
        items: codOrderItems,
        totalPrice: cart.totalPrice,
        paymentMethod: { method: 'cod' },
        orderDate: today.toDate(),
      });
    }

    await order.save();

    // Clear the user's cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    const products = await Products.find({}).populate('category');
    const banners = await banerModel.find();

    res.render('userPages/index', {
      success: 'Your order has been placed successfully via Cash on Delivery.',
      error: null,
      products,
      banners,
    });
  } catch (error) {
    console.error('Error in COD purchase:', error);
    res.status(500).send({
      msg: 'An error occurred while processing your COD order. Please try again later.',
    });
  }
};



const getOrderDates = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) {
      console.log('Please log in');
      return res.redirect('/login');  // Redirect to login if user is not authenticated
    }

    // Fetch all orders for the user
    const orders = await orderModel.find({ user: user._id });

    // Group orders by date (ignoring time part) to get unique order dates
    const orderDates = [];
    orders.forEach(order => {
      const orderDateOnly = new Date(order.orderDate).toISOString().split('T')[0];
      console.log(orderDateOnly); // Debugging orderDateOnly
      if (!orderDates.includes(orderDateOnly)) {
        orderDates.push(orderDateOnly);
      }
    });
    

    // Render the page with the unique order dates
    res.render('userPages/viewOrder', {
      orderDates,
      user
    });
  } catch (err) {
    console.log('Error:', err);
    return res.status(500).send({
      msg: 'An error occurred while fetching order dates',
    });
  }
};


const getOrderDetailsByDate = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) {
      return res.status(401).send({
        msg: 'Please log in',
      });
    }

    const orderDate = req.query.orderDate;
    if (!orderDate) {
      return res.status(400).send({
        msg: 'Order date is required',
      });
    };
    const startOfDay = new Date(orderDate);
    startOfDay.setUTCHours(0, 0, 0, 0); // Start of the day in UTC
    const endOfDay = new Date(orderDate);
    endOfDay.setUTCHours(23, 59, 59, 999); // End of the day in UTC
    
    // Debug the range
    // console.log({ startOfDay, endOfDay });

    const orderItemsInDate = await orderModel.find({
      user: user._id,
      orderDate: { $gte: startOfDay, $lte: endOfDay },
    }).populate('items.products');
    
    console.log(orderItemsInDate);

    res.render('userPages/allOrderView', {
      orderItemsInDate
    });

  } catch (err) {
    console.log(err);
    return res.status(500).send({
      msg: 'An error occurred while fetching order details for the selected date',
    });
  }
};


const contactPage = (req, res) => {
   res.render('userPages/contact', {
    error : null,
    success : null,
   });
};

const contactUs = async (req, res) => {
  try {
    const {email, msg} = req.body;
    const user = req.session.user;
    console.log(user);
    console.log('email : ', email);
    console.log('msg : ', msg);
   
    const transporter = nodemailer.createTransport({
      service : 'gmail',
      auth : {
        user : process.env.NODEMAIL_MAIL,
        pass : process.env.NODEMAIL_PASSWORD 
      }
    });

    await transporter.sendMail({
      from : email,
      to : process.env.NODEMAIL_MAIL,
      subject : `A Message Recieved From ${user.fullName}`,
      text : msg,
      replyTo : email
    })
    console.log('msg sent successfully');
    return res.render('userPages/contact', {
     error : null,
     success : 'msg sent successfully'
    })
  } catch (err) {
    console.log('error', err);
    return res.send({
      msg : 'an error occured in while contacting us'
    })
  }
}

const productSearch = async (req, res) => {
  const query = req.query.query;

  try {
    const results = await Products.find({
      name: { $regex: query, $options: 'i' }
    }).populate('category')

    
    res.json({ results});
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ message: 'Error occurred while searching' });
  }
}

const logout = async (req, res) => {
  const products = await Products.find({}).populate('category');
  const banners = await banerModel.find()
  req.session.destroy((err) => {
    if(err){
      console.error(err)
    }
    return res.render('userPages/index', {
      products,
      banners,
      success : 'successfully logged out',
      error : null,
      user : null
    });
  })
}

export {
  homePage,
  signup,
  loginPage,
  loginAuth,
  contactPage,
  contactUs,
  myProfile,
  userInfoPage,
  logout,
  addToCartAuth,
  CartPage,
  removeCartItem,
  addToWishList,
  wishListPage,
  removeWishListproduct,
  productPage,
  productDetailsPage,
  addAddress,
  orderPage,
  stripePay,
  orderSuccess,
  orderCancel,
  cod_purchase,
  quantityChange,
  productSearch,
  getOrderDates,
  getOrderDetailsByDate
}