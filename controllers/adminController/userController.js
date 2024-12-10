import Admins from "../../models/adminSchema.js";
import User from "../../models/userModels.js"
import bcrypt from "bcryptjs/dist/bcrypt.js";


const adminLoginPage = (req, res) => {
  res.render('adminPages/adminLogin',{
     error: null,
     success : null
  });
}

const adminLoginAuth = async (req, res) => {
    const {userName, password} = req.body;
    try {
      const admin = await Admins.findOne({userName});
      if(admin && admin.password === password){
        return res.render('adminPages/adminHome', {
          error : null,
          success : 'welcome admin'
        });
      }else{
        return res.render('adminPages/adminLogin', {
          error : 'invalid credentials',
          success : null
        });
      }
    } catch (error) {
      console.error(error)
    }
};

const adminHomePage = async (req, res) => {
   try {
    res.render('adminPages/adminHome', {
      error : null,
      success : null
    })

   } catch (err) {
      console.error(err);
      res.status(500).send({
        success : false,
        message : 'error in admnHomePage controller'
      })
   }
}

const manageUser = async (req, res) => {
      //  const users = await User.find();
      const  {users,currentPage, totalPages, totalUsers, limit} = req.pagination;
      // const users = await User.find
      return res.render('adminPages/manageUser/viewUsers', {
        users,
        currentPage,
        totalPages,
        totalUsers,
        limit,
      })

};

const editUserPage = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
    
  try {
    res.render('adminPages/manageUser/editUser', {
      user,
      error : null,
      success : null
    })
  } catch (error) {
    console.error(error)
  }
};

const editUser = async (req, res) => {
  const userId = req.params.id;
  const {fullName, email, mobile, zip, address} = req.body;

  try {
    
    const user = await User.findByIdAndUpdate(userId, {
      fullName,
      email,
      mobile,
      zip,
      address
  }, {new : true});

    if(user){
       return res.render('adminPages/manageUser/editUser', {
        user : user,
        success : 'updated successfully',
        error : null
    })
    }else{
      return res.render('adminPages/manageUser/editUser', {
        user : user ,
        error : 'updatation failed',
        success : null
      })
    }
  } catch (error) {
    console.error(error)
  }
};

const blockUser = async (req, res) => {
     try {
         const userId = req.params.id;
         console.log(userId);

         const user = await User.findById({_id : userId});
         console.log(user);

         const blockUser = await User.findByIdAndUpdate({_id : userId}, {$set : {isBlocked : true}});

         if(blockUser){
          console.log(`user ${user.fullName} is blocked`);
          console.log(user);
         }else{
          console.log('user is not blocked');
         };

     } catch (err) {
      console.log('error : ', err);
      return res.send({
        msg : 'error occured while blocking the user'
      })
    }
}

// const addUserPage = (req, res) => {
//   res.render('adminPages/manageUser/addUser', {
//     error : null
//   })
// };

// const addUserAuth = async (req, res) => {
//   const  {users,currentPage, totalPages, totalUsers, limit} = req.pagination;
//   const {fullName, email, password, mobile, zip, address} = req.body;
//   const hashedPass = await bcrypt.hash(password, 10)
//      try {
//       const newUser =  new User({
//         fullName,
//         email,
//         password: hashedPass,
//         mobile,
//         zip,
//         address
//       })
//       await newUser.save();
//       // const ActiveUsers = await User.find()
//       // console.log('new user is created')
//       if(newUser){
//         return res.render('adminPages/manageUser/viewUsers', {
//           // ActiveUsers,
//           users,
//           currentPage, 
//           totalPages,
//           totalUsers, 
//           limit
//          })
//       }else{
//          res.render('adminPages/manageUser/addUser', {
//           error : 'user is not created'
//          })
//       }
//      } catch (error) {
//       console.error(error)
//      }
// };

const searchUser = async (req, res) => {
  try {

    const searchQuery = req.body.searchQuery.toLowerCase();
    console.log(searchQuery)
    const results = await User.find({fullName : {$regex : searchQuery, $options : 'i'}});

    console.log(results);
    res.json(results);

  } catch (err) {
    console.log(err)
  }
}

export {
  adminLoginPage,
  adminLoginAuth,
  manageUser,
  editUserPage,
  editUser,
  // addUserPage,
  // addUserAuth,
  adminHomePage,
  searchUser,
  blockUser
}
