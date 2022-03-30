// Importing express module
const express = require("express")
const router = express.Router()
const subcategoryController = require('../../controllers/subcategoryController')
const authenticateJWT = require('../../middlewares/authenticate')
const cors = require('cors')


router.use(cors());
 
  // Sub Category API
  router.post('/create-sub-category', authenticateJWT, subcategoryController.createSubCategory);
  router.post('/update-sub-category', authenticateJWT, subcategoryController.updateSubCategory);
  router.post('/get-sub-category', authenticateJWT, subcategoryController.getSubCategory);
  router.post('/getAll-sub-category', authenticateJWT, subcategoryController.getSubCategoryaAll);
  router.post('/delete-sub-category', authenticateJWT, subcategoryController.deleteSubCategory);
  router.post('/sub-category-by-category', subcategoryController.getSubCategoryByCategory);

  // User Sub Category API
  router.post('/api/sub-category-by-category', subcategoryController.getSubCategoryByCategory);

  
   
  





module.exports = router;