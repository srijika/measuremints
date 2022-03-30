// Importing express module
const express = require("express")
const router = express.Router()
const mintController = require('../../controllers/mintController')
const authenticateJWT = require('../../middlewares/authenticate')
const cors = require('cors')
const upload = require("../../middlewares/image_upload");


 
router.use(cors());
 
  // Mint API
  router.post('/api/create-mint', upload.any(), mintController.createMint);
  router.post('/api/get-my/mint',  mintController.getMyMint);
  router.post('/api/get-user/mint',  mintController.getUserMint);
  router.post('/api/get-user/attribute',  mintController.getUserMintAttribute);
  router.post('/api/update-user/attribute',  mintController.updateUserMintAttribute);





  

  
   
  





module.exports = router;