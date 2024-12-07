import User from "../../models/userModels.js"
import orderModel from '../../models/orderSchema.js'

const orderPage = async(req, res) => {
  
  const users = await User.find();
  
  res.render('adminPages/manageOrder/orderdUsers', {
    users
  });

}

const getOrdersDate = async (req, res) => {
    try {
   
      const userId = req.params.id;
      console.log(userId);

      const user = await User.findById(userId);
      // !user ? console.log('not found user'): console.log(user);
      
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
      res.render('adminPages/manageOrder/orderdUsersDetails', {
        orderDates,
        user
      });
      
    } catch (err) {
      console.error(err);
      return res.status(200).send({
        msg : 'error occured in orderDetails page in admin side'
      })
    }
};

const getOrderDetailsByDate = async (req, res) => {
  try {
    const userId = req.params.id;
    // console.log(userId)
    const user = await User.findById(userId);
    // console.log(user)
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
    
    // console.log(orderItemsInDate);

    res.render('adminPages/manageOrder/orderdusersItems', {
      orderItemsInDate
    });

  } catch (err) {
    console.log(err);
    return res.status(500).send({
      msg: 'An error occurred while fetching order details for the selected date',
    });
  }
};

export {
  orderPage,
  getOrdersDate,
  getOrderDetailsByDate
}