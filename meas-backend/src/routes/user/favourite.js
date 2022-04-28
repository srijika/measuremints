// Importing express module
const express = require("express")
const router = express.Router()
const favouriteController = require('../../controllers/favouriteController')
const authenticateJWT = require('../../middlewares/authenticate')
const cors = require('cors')


 
router.use(cors());
 
  // FAVORITE API
  router.post('/api/add/favorite',authenticateJWT , favouriteController.addFavorite);
  router.post('/api/remove/favorite',authenticateJWT , favouriteController.removeFavorite);
  router.post('/api/get/my/favorite',authenticateJWT , favouriteController.getMyFavorite);





module.exports = router; 