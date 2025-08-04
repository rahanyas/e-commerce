import cloudinary from 'cloudinary';
import getDataUri  from "../../utils/features.js";
import Products from "../../models/productSchema.js"
import categoryModel from '../../models/categorySchema.js';



export const getAllProducts = async (req, res) => {
   try {

    const {products, currentPage, totalPages, totalProducts, limit} = req.pagination;
   
    res.render('adminPages/manageProducts/viewProducts', {
      currentPage ,
      totalPages ,
      totalProducts ,
      limit,
      products 
    })

   } catch (error) {
     console.error(error);
     res.status(500).send({
       success : false,
       message : 'error in get all products api',
       error
     })
   }
};



export const addProductPage = (req, res) => {
  res.render('adminPages/manageProducts/addProducts')
}

export const createProduct = async (req, res, next) => {
  try {
    const {brand, name, price, description, stock, color} = req.body;
    const {category : categoryName} = req.body;

    const {products, currentPage, totalPages, totalProducts, limit} = req.pagination;


    if(!name || !brand || !price || !description || !stock ||!categoryName){
      return res.status(500).send({
        success : false,
        message : 'please provide all fields'
      })
    }
    if(!req.file){
      return res.status(500).send({
        success : false,
        message : 'please provide an image'
      })
    }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url : cdb.secure_url
    };
    let category = await categoryModel.findOne({category : categoryName});
    if(!category){
      category = await categoryModel.create({category : categoryName})
    }
    await Products.create({
      name, 
      description, 
      price, 
      brand,
      stock,
      color,
      images:[image],
      category : category._id
    });
    // res.status(201).send({
    //   success : true,
    //   message : 'product created successfully'
    // })
    // const products = await Products.find({})
    // return res.render('adminPages/manageProducts/viewProducts', {
    //   products
    // })
    
    res.render('adminPages/manageProducts/viewProducts', {
      products, 
      currentPage ,
      totalPages ,
      totalProducts ,
      limit,
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success : false,
      message : 'cannot post createProduct'.
      error
    })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Products.findById(productId);
    console.log(productId)
    if(!product){
      return res.status(400).send({
        success : false,
        message : 'product not found'
      })
    }
    await Products.findByIdAndDelete(productId);
    if(!deleteProduct){
      return res.status(400).send({
        success : false,
        message : 'product is not deleted'
      })
    }
    return res.status(200).send({
      success : true,
      message : 'product delted successfully'
    })
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success : false,
      message : 'error get single product',
      error
    })
  }
};

export const editProductPage = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Products.findById(productId);
    const category = await categoryModel.findById(product.category);
    const categoryName = category ? category.category : '';
    if(!product){
      res.status(404).send({
        success : false,
        message : 'prdouct is not found'
      })
    }
     res.render('adminPages/manageProducts/editProducts', {
      product,
      categoryName
     })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success : false,
      message : 'error occured while getting the editPage'
    })
  }

};

// export const editProduct = async (req, res) => {
//   try {
//     const {name, brand, price, stock, description} = req.body;
//     const {category} = req.body;
//     const productId = req.params.id;
//     const product = await Products.findById(productId);
//     const categoryName = await categoryModel.findById(product.category);
//     const file = getDataUri(req.file);
//     const cdb = await cloudinary.v2.uploader.upload(file.content);
//     const image = {
//       public_id: cdb.public_id,
//       url : cdb.secure_url
//     };
//     const updateProduct = await Products.findByAndUpdate(product);
//     const updatedCateg = await categoryModel.findByAndUpdate(categoryName);

     
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success : false,
//       message : 'an error occured while updating the product'
//     })
//   }
// }

// export const editProduct = async (req, res) => {
//   try {
//     const { name, brand, price, stock, description, category } = req.body;
//     const productId = req.params.id;
  
//     let updateData = {
//       name,
//       brand,
//       price,
//       stock,
//       description,
//       category,
//       // images : [image]
//     };

//     if (req.file) {
//       const file = getDataUri(req.file);
//       const cdb = await cloudinary.v2.uploader.upload(file.content);

//       const image = {
//         public_id: cdb.public_id,
//         url: cdb.secure_url
//       };
//       updateData.images = [image];
//     }
    
//     const updatedProduct = await Products.findByIdAndUpdate(productId, updateData, { new: true });

//     if (category) {
//       await categoryModel.findByIdAndUpdate(updatedProduct.category, { category: category });
//     }
    
//     const products = await Products.find()
//     // res.status(200).send({
//     //   success: true,
//     //   message: 'Product updated successfully',
//     //   product: updatedProduct
//     // });

//     return res.render('adminPages/manageProducts/viewProducts',{
//       error : null,
//       success : 'product updated successfully',
//       products 
//     } )

//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: 'An error occurred while updating the product'
//     });
//   }
// };


export const editProduct = async (req, res) => {
  try {
    const { name, brand, price, stock, description, category, color } = req.body;
    const productId = req.params.id;

    let categoryObjectId = null;
    if (category) {
      const categoryDoc = await categoryModel.findOne({ category });
      if (categoryDoc) {
        categoryObjectId = categoryDoc._id; 
      } else {
        return res.status(400).send({
          success: false,
          message: 'Invalid category provided'
        });
      }
    }
    const colors = color.split(',').map(c => c.trim());
    let updateData = {
      name,
      brand,
      price,
      stock,
      color:colors,
      description,
      category: categoryObjectId, 
    };

    if (req.file) {
      const file = getDataUri(req.file);
      const cdb = await cloudinary.v2.uploader.upload(file.content);

      const image = {
        public_id: cdb.public_id,
        url: cdb.secure_url
      };
      updateData.images = [image];
    }

    const updatedProduct = await Products.findByIdAndUpdate(productId, updateData, { new: true });
    const {products, currentPage, totalPages, totalProducts, limit} = req.pagination;
    // const products = await Products.find({});
    return res.render('adminPages/manageProducts/viewProducts', {
      error: null,
      currentPage,
      totalPages, 
      totalProducts, 
      limit,
      products
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'An error occurred while updating the product'
    });
  }
};
