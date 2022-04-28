// Importing express module
const express = require("express")
const router = express.Router()
const authCtrl = require('../../controllers/authController')
const authenticateJWT = require('../../middlewares/authenticate')
const cors = require('cors')
const upload = require("../../middlewares/image_upload");


router.use(cors());
// ***USERS API****
//All Users API checking prefix
router.post('/api/send-otp', authCtrl.sendOtp)
router.post('/api/signup', upload.any(), authCtrl.signup)
router.post('/api/user/login', authCtrl.loginUser)
router.post('/api/user/resetPassword', authCtrl.recoverPasswordUser)




router.post('/api/resetPassword/mobile', authCtrl.forgotpasswordmobile);
router.get('/api/resetPasswordView/mobile', authCtrl.recoverpasswordmobileview);
router.post('/api/recoverPassword/mobile', authCtrl.recoverpasswordfrommobile);
router.post('/api/verify/otp', authCtrl.verifyOtp)
router.post('/api/forgetpassword', authCtrl.forgotpassword);
router.post('/api/get-all/users', authCtrl.getAllUser);





module.exports = router;