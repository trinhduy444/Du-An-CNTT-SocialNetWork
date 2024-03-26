const express = require('express');
const router = express.Router();
const {authentication} = require('../middleware/auth.middleware');
const {createLikeAPost,createDisLikeAPost,createComment,createDisLikeAComment,createLikeAComment,deleteComment,updateComment,getAllCommentFromAPost} = require('../controllers/react.controller');

router.route('/likeAPost/:postId').post(authentication,createLikeAPost);
router.route('/likeAComment/:commentId').post(authentication,createLikeAComment);
router.route('/dislikeAPost/:postId').post(authentication,createDisLikeAPost);
router.route('/dislikeAComment/:commentId').post(authentication,createDisLikeAComment);

router.route('/createComment/:postId').post(authentication,createComment);
router.route('/deteleComment/:commentId').post(authentication,deleteComment);
router.route('/updateComment/:commentId').post(authentication,updateComment);
router.route('/getAllCommentFromAPost/:postId').get(getAllCommentFromAPost);

// router.route('/cancelReact/:reactId').delete(authentication,createLikeAComment);

module.exports = router;