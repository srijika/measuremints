// Importing express module
const express = require("express")
const router = express.Router()
const giftController = require('../../controllers/giftController')
const authenticateJWT = require('../../middlewares/authenticate')
const cors = require('cors')


 
router.use(cors());
 
  // GIFTS API
  router.post('/api/send-gift',authenticateJWT , giftController.sendGift);
//   router.post('/api/remove/favorite',authenticateJWT , favouriteController.removeFavorite);
//   router.post('/api/get/my/favorite',authenticateJWT , favouriteController.getMyFavorite);

module.exports = router; 