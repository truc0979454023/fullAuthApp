const router = require('express').Router()
const userCtrl = require('../controller/userCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.post('/register', userCtrl.register)
router.post('/activation', userCtrl.activateEmail)
router.post('/login', userCtrl.login)
router.post('/refresh_token', userCtrl.getAccessToken)
router.post('/forgot_password', userCtrl.forgotPassword)
router.post('/reset_password', auth, userCtrl.resetPassword)
router.get('/infor', auth, userCtrl.getUserInfor)
router.get('/all_infor', auth, authAdmin, userCtrl.getUserAllInfor)
router.get('/logout', userCtrl.logout)
router.patch('/update', auth, userCtrl.updateUser)
router.patch('/update_role/:id', auth, authAdmin, userCtrl.updateUserRole)
router.delete('/delete/:id', auth, authAdmin, userCtrl.deleteUser)

// --------Social Login--------------------------------
router.post('/google_login', userCtrl.googleLogin)
router.post('/facebook_login', userCtrl.facebookLogin)


module.exports = router