
import Products from "../../models/productSchema.js";
import User from "../../models/userModels.js";

 const Adminpagination = async (req, res, next) => {
  try {
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
  
    const products = await Products.find({})
    .skip(skip)
    .limit(limit)
    .exec();
    
    const total = await Products.countDocuments();
    const totalPages = Math.ceil(total / limit);
    req.pagination = {
      products,
      currentPage : page,
      totalPages,
      totalProducts : total,
      limit
    }
    next()
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success : false,
      message : 'an error occured in pagination'
    })
  }
}

 const UserPagination = async (req, res, next) => {
   try {
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const users = await User.find({})
    .skip(skip)
    .limit(limit)
    .exec();
    const total = await User.countDocuments();
    const totalPages = Math.ceil(total / limit);

    req.pagination = {
      users,
      currentPage : page,
      totalPages,
      totalUsers : total,
      limit
    };

    next()

   } catch (error) {
    console.error(err)
    res.status(500).send({
      success : false,
      message : 'error occured in userPagination'
    })
   }
}


export  {
  Adminpagination,
  UserPagination
}