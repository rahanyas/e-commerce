import express from "express";
import { addProductPage, 
        createProduct, 
        getAllProducts, 
        deleteProduct,
        editProductPage,
        editProduct
} from "../controllers/adminController/productController.js";

import Upload from "../middlewares/multer.js";
import {Adminpagination} from "../public/helpers/pagination.js";

// import {addProduct, viewProducts} from '../controllers/adminController/productController.js'

const router = express.Router();

 
router.get('/admin/products',Adminpagination, getAllProducts);
router.get('/add-product', addProductPage);
router.post('/addProduct', Upload,Adminpagination, createProduct);
router.get('/delete-product/:id', deleteProduct);
router.get('/edit-product/:id',  editProductPage);
router.post('/edit-Product/:id',Upload, Adminpagination, editProduct);

export default router;