// Importing express module
const express = require("express")
const router = express.Router()
const authCtrl = require('../../controllers/authController')
const authenticateJWT = require('../../middlewares/authenticate')
const cors = require('cors')
const upload = require("../../middlewares/image_upload");


router.use(cors());
// ***ADMIN APIS****
router.post('/api/admin/login', authCtrl.adminLogin)
router.post('/api/admin/resetPassword', authCtrl.adminrecoverpassword);





module.exports = router;