import User from "../../models/userModels.js"
import orderModel from '../../models/orderSchema.js'

const orderPage = async(req, res) => {
  
  const users = await User.find();
  
  res.render('adminPages/manageOrder/orderdUsers', {
    users
  });

}

const orderDetailsPage = async (req, res) => {
    try {
   
      const userId = req.params.id;
      console.log(userId);

      const user = await User.findById(userId);
      // !user ? console.log('not found user'): console.log(user);
      
      const order = await orderModel.findOne({user : user._id}).populate('items.products');
      console.log(Array.isArray(order));

      // !order?console.log('user has not placed any order'):console.log(order);
  
      res.render('adminPages/manageOrder/orderdUsersDetails', {
        order,
        user
      });
      
    } catch (err) {
      console.error(err);
      return res.status(200).send({
        msg : 'error occured in orderDetails page in admin side'
      })
    }
};

export {
  orderPage,
  orderDetailsPage
}