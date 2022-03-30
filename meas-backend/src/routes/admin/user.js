// Importing express module
const express = require("express")
const router = express.Router()
const userController = require('../../controllers/userController')
const authenticateJWT = require('../../middlewares/authenticate')
const cors = require('cors')
const upload = require("../../middlewares/image_upload");
router.use(cors());

//USER API
router.post('/api/getprofile', authenticateJWT, userController.getprofile)
router.post('/api/user/editprofile', authenticateJWT, upload.any(), userController.editprofile)
router.post('/api/user/updateprofile', upload.any(), userController.updateUserProfile)
router.post('/api/get-user-detail', authenticateJWT, userController.getUserDetail)
router.post('/api/deleteuser', userController.deleteuser)


//ADMIN API
router.post('/api/admin/updateprofile', authenticateJWT, upload.any(), userController.adminupdateprofile);



 

//Get All User
router.post('/api/getalluserlist', userController.getalluser);


//User Active and Deactive
router.post('/api/user-active', userController.userActive)
router.post('/api/user/status', userController.userActiveDeactiveStatus)

 


module.exports = router;