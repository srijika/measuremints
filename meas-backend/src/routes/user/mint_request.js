// Importing express module
const express = require("express")
const router = express.Router()
const mintRequestController = require('../../controllers/mintRequestController')
const authenticateJWT = require('../../middlewares/authenticate')
const cors = require('cors')
 
router.use(cors());
 
  // Mint API
  router.post('/api/send-mint-request',authenticateJWT, mintRequestController.sendMintRequest);
  router.post('/api/accept-mint-request',authenticateJWT,mintRequestController.acceptMintRequest);
  router.post('/api/get-all-mint-request',authenticateJWT,mintRequestController.getAllMintRequests);
  router.post('/api/my-all-mints',authenticateJWT,mintRequestController.myAllMints);

module.exports = router;