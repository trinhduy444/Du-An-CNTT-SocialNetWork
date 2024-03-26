const express = require('express');
const router = express.Router();
const {authentication} = require('../middleware/auth.middleware');
const {signUp, logIn, logOut, refreshAccessToken, resetPassword, forgotPassword, changePassword }= require('../controllers/auth.controller');

router.route('/signup').post(signUp);
router.route('/login').post(logIn);
router.route('/logout').post(authentication, logOut);
router.route('/refreshAT').post(authentication,refreshAccessToken);
router.route('/resetPassword/:secretToken').post(resetPassword);
router.route('/forgotPassword').post(forgotPassword);
router.route('/changePassword').post(authentication,changePassword);

module.exports = router;