// Importing express module
const express = require("express")
const router = express.Router()
const calendarController = require('../../controllers/calendar_eventController')
const authenticateJWT = require('../../middlewares/authenticate')
const cors = require('cors')
const upload = require("../../middlewares/image_upload");


 
router.use(cors());
 
  // Mint API
  router.post('/api/create-calendar/event',authenticateJWT, calendarController.createCalendar);
  router.post('/api/get-calendar/events',authenticateJWT,calendarController.getCalendar);





  

  
   
  





module.exports = router;