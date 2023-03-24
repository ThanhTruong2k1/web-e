const express = require('express')
const router = express.Router();

const 
{
    createProduct ,
    updateProduct,
    deleteProduct,
    getaProduct,
    getAllProduct,
}= require('../controller/productCtrl');
const { blogImgResize, uploadPhoto } = require("../middlewares/uploadImages");
router.post("/",
    uploadPhoto.array("images", 2),
    blogImgResize,
    createProduct);
router.put("/:id",updateProduct);
router.delete("/:id",deleteProduct),
router.get('/:id',getaProduct),
router.get('/',getAllProduct)
module.exports = router;