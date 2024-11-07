// import categoryModel from "../models/categorySchema.js";
// import Products from "../models/productSchema.js";

// const getProductsByCategory = async (req, res) => {
//   try {
    
//     const menCategory = await categoryModel.findOne({category : 'men'});
//     const womenCategory = await categoryModel.findOne({category : 'women'});
    
//     const menProducts = await Products.find({category : menCategory._id}).populate('category');
//     const womenProducts = await Products.find({ category : womenCategory._id}).populate('category');
     
//     return {
//       menProducts: menProducts || [],  
//       womenProducts: womenProducts || [], 
//       menCategory: menCategory || {},  
//       womenCategory: womenCategory || {}  
//     };
 
//   } catch (err) {
//     console.error(err);
//      throw new Error('error occured in getProductsBYcategory')
//   }
// }

// export default getProductsByCategory;