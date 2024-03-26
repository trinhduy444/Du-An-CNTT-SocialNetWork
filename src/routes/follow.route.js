const express = require('express');
const router = express.Router();
const {authentication} = require('../middleware/auth.middleware');
const {follow,unFollow,getAllFollowers,getAllFollowersById,getAllFolloweds,getAllFollowedsById,checkFollow} = require('../controllers/interaction.controller');

router.route('/addFollow/:followedId').post(authentication,follow);
router.route('/unFollow/:followedId').post(authentication,unFollow);
router.route('/getAllFollowers').post(authentication,getAllFollowers);
router.route('/getAllFollowersById/:followed_id').get(getAllFollowersById);
router.route('/getAllFolloweds').post(authentication,getAllFolloweds);
router.route('/getAllFollowedsById/:follower_id').get(getAllFollowedsById);
router.route('/checkFollow/:followedId').get(checkFollow);


module.exports = router;