const express = require('express');
const router = express.Router();
const {authentication} = require('../middleware/auth.middleware');
const {getProfile, updateProfile, updateAvatar, getAvatar, getAvatarByName,viewProfileByID} = require('../controllers/user.controller');

const {upload} = require('../middleware/multer.middleware');

router.route('/getProfile').post(authentication,getProfile);
router.route('/updateProfile').post(authentication,updateProfile);
router.route('/updateAvatar').post(authentication,upload.single('avatar'),updateAvatar);
router.route('/getAvatar').post(authentication,getAvatar);
router.route('/getAvatarByName/:filename').get(getAvatarByName);
router.route('/viewProfileByID/:userid').get(viewProfileByID);
module.exports = router;