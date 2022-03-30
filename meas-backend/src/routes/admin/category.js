// Importing express module
const express = require("express")
const router = express.Router()
const categoryController = require('../../controllers/categoryController')
const authenticateJWT = require('../../middlewares/authenticate')
const cors = require('cors')


router.use(cors());
  // Category API
  router.post('/list/category',  categoryController.getCategoryList);
  router.post('/create/category', authenticateJWT, categoryController.createCategory);
  router.post('/update/category', authenticateJWT, categoryController.updateCategory);
  router.post('/delete/category', authenticateJWT, categoryController.deleteCategory);
 
  //User Category API
  router.get('/api/user/category-list',  categoryController.getUserCategoryList);






module.exports = router;