const express=require('express')
const router=express.Router()
const authController=require('../controllers/authController')
const auth=require('../middleware/auth')

router.post('/register',authController.registerUser)
router.post('/login',authController.loginUser)
router.get('/profile',auth.authMiddleware,authController.getProfile) 
router.get('/admin/dashboard',auth.authMiddleware,auth.authorizeRole('admin'),authController.adminDashboard)
router.get('/common',auth.authMiddleware,auth.authorizeRole('admin','student'),authController.commonDashboard)
router.get('/student',auth.authMiddleware,auth.authorizeRole('student'),authController.studentDashboard)
router.get('/logout',authController.logoutUser)


module.exports=router