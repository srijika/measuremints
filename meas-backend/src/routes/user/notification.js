// Importing express module
const express = require("express")
const router = express.Router()
const notificationController = require('../../controllers/notificationController')
const authenticateJWT = require('../../middlewares/authenticate')
const cors = require('cors')


 
router.use(cors());
 
  // NOTIFICATION API
  router.post('/api/add/favorite',authenticateJWT , notificationController.addNotification);
  router.post('/api/remove/notification',authenticateJWT , notificationController.removeNotification);
  router.post('/api/get/my/notification',authenticateJWT , notificationController.getMyNotification);





module.exports = router; 