import express from "express";
const adminrouter = express.Router();
import {adminLoginPage, adminLoginAuth, manageUser, editUserPage, editUser, addUserPage, addUserAuth, adminHomePage} from "../controllers/adminController/userController.js";
import {UserPagination} from "../public/helpers/pagination.js";

adminrouter.get('/adminLogin', adminLoginPage);
adminrouter.post('/adminLoginAuth', adminLoginAuth);
adminrouter.get('/adminHome',adminHomePage)
adminrouter.get('/admin/users', UserPagination, manageUser);
adminrouter.get('/admin/users/edit/:id', editUserPage)
adminrouter.post('/editUser/:id', editUser);
adminrouter.get('/admin/users/add', addUserPage);
adminrouter.post('/addUser', UserPagination, addUserAuth);

export default adminrouter;