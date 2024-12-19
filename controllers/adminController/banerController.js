import banerModel from "../../models/banerSchema.js";
import cloudinary from 'cloudinary';
import getDataUri  from "../../utils/features.js";

const banerPage = async (req, res) =>  {
  try {
    const baners = await banerModel.find();
    !baners ? console.log('db has no baners'): console.log(baners);
    // console.log(Array.isArray(baners))
    res.render('adminPages/manageBaner', {
      baners
    })
  } catch (error) {
    return res.status(500).send({
      msg : 'an error occured in baner page '
    })
  }
}

const addBaner =  async (req, res) => {
 try {

  const {titleOne, titleTwo, titleThree, active} = req.body;
  if(!titleOne || !titleTwo || !titleThree || !active){
     return res.send({
      msg : 'please proivde all input field'
     })
  }

  if(!req.file){
   return res.send({
    msg : 'provide an img file'
   })
  }
  // console.log(req.body);
  // console.log(req.file);
  
 const file = getDataUri(req.file);
 const cdb = await cloudinary.v2.uploader.upload(file.content);
 const image = {
  public_id : cdb.public_id,
  url : cdb.secure_url
 }
 
 await banerModel.create({
   titleOne,
   titleTwo,
   titleThree,
   images : [image],
   isActive: active === "true"
 })

 return res.status(200).send({
  msg : 'banner added successfully'
 })

 } catch (error) {
   return res.status(500).send({
    msg : 'an error occured in the addBaner'
   })
 }
}

export {
  banerPage,
  addBaner
}