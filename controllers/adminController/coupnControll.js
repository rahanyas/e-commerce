import Coupon from "../../models/couponSchema.js";

export const viewCoupnPage = async (req, res) => {
   const coupon = await Coupon.find()
   res.render('adminPages/mangeCoupon', {
      coupon
   });
};

export const addCoupons = async (req, res) => {
   try {
      const {code, description, discount, minAmount} = req.body;
      console.log(req.body);
      
       const exisistingCoupon = await Coupon.findOne({code : code})
       if(!exisistingCoupon){
         const newCoupon  = new Coupon({
            code : code,
            description : description,
            discount : discount,
            minimumPurchase : minAmount
         });
        console.log(newCoupon);

        await newCoupon.save();
        const coupon = await Coupon.find()
        return res.render('adminPages/mangeCoupon', {
            coupon
        });
        
       }else{
          return res.send({
            msg : 'coupon already exists'
          })
       }

   } catch (err) {
      console.log('error : ', err);
      return res.status(500).send({
         msg : 'an error occured in add coupon '
      })
   }
}