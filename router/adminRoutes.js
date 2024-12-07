import express from "express";
const adminrouter = express.Router();
import Upload from "../middlewares/multer.js";

import { adminLoginPage, 
         adminLoginAuth, 
         manageUser, 
         editUserPage, 
         editUser, 
         addUserPage, 
         addUserAuth, 
         adminHomePage
        } 
from "../controllers/adminController/userController.js";

import {
        UserPagination
       } 
from "../public/helpers/pagination.js";

import {
        getOrderDetailsByDate,
        getOrdersDate,
        orderPage,     
       } 
from "../controllers/adminController/orderController.js";

import { 
        addBaner,
        banerPage 
} from "../controllers/adminController/banerController.js";


adminrouter.get('/adminLogin', adminLoginPage);
adminrouter.post('/adminLoginAuth', adminLoginAuth);
adminrouter.get('/adminHome',adminHomePage)
adminrouter.get('/admin/users', UserPagination, manageUser);

adminrouter.get('/admin/users/edit/:id', editUserPage)
adminrouter.post('/editUser/:id', editUser);

adminrouter.get('/admin/users/add', addUserPage);
adminrouter.post('/addUser', UserPagination, addUserAuth);

adminrouter.get('/admin/orders', orderPage);
adminrouter.get('/viewOrderDetails/:id', getOrdersDate);
adminrouter.get('/Details/:id', getOrderDetailsByDate);

adminrouter.get('/admin/baners', banerPage)
adminrouter.post('/admin/baners/addBaner',Upload, addBaner)

export default adminrouter;