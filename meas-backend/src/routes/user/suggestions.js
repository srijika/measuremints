// Importing express module
const express = require("express")
const router = express.Router()
const suggestionsController = require('../../controllers/suggestionsController')
const authenticateJWT = require('../../middlewares/authenticate')
const cors = require('cors')


 
router.use(cors());
 
  // SUGGESTIONS API
  router.post('/api/send-suggestion',authenticateJWT , suggestionsController.sendSuggestion);
  router.post('/api/get-all-suggestion',authenticateJWT , suggestionsController.getAllSuggestions);

module.exports = router; 