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
        limit
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
}

const addUserPage = (req, res) => {
  res.render('adminPages/manageUser/addUser', {
    error : null
  })
};

const addUserAuth = async (req, res) => {
  const  {users,currentPage, totalPages, totalUsers, limit} = req.pagination;
  const {fullName, email, password, mobile, zip, address} = req.body;
  const hashedPass = await bcrypt.hash(password, 10)
     try {
      const newUser =  new User({
        fullName,
        email,
        password: hashedPass,
        mobile,
        zip,
        address
      })
      await newUser.save();
      // const ActiveUsers = await User.find()
      // console.log('new user is created')
      if(newUser){
        return res.render('adminPages/manageUser/viewUsers', {
          // ActiveUsers,
          users,
          currentPage, 
          totalPages,
          totalUsers, 
          limit
         })
      }else{
         res.render('adminPages/manageUser/addUser', {
          error : 'user is not created'
         })
      }
     } catch (error) {
      console.error(error)
     }
}

export {
  adminLoginPage,
  adminLoginAuth,
  manageUser,
  editUserPage,
  editUser,
  addUserPage,
  addUserAuth,
  adminHomePage
}
