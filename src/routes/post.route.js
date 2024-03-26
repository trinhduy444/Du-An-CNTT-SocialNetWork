const express = require('express');
const router = express.Router();
const {authentication,checkAuthIsAdmin} = require('../middleware/auth.middleware');
const {getAllPostTypes,createPost,editPost,getPost,openDetail,deletePost,displayFile,displayFileFromAPost,getAllPostByType,getAllPostByUser,getAllPost} = require('../controllers/post.controller');
const {upload} = require('../middleware/multer.middleware');
const reactRouter = require('./react.route');
router.route('/getAllPostType').get(getAllPostTypes);
router.post('/createPost', authentication,upload.fields([
    { name: 'image', maxCount: 4 },
    { name: 'video', maxCount: 1 },
  ]), createPost);
router.route('/getDetail/:postId').get(openDetail);
router.route('/deletePost/:postId').post(authentication,deletePost);
router.route('/editPost/:postId').post(authentication,upload.fields([
    { name: 'image', maxCount: 4 },
    { name: 'video', maxCount: 1 },
  ]),editPost);
router.route('/getPost/:postId').get(getPost);
router.route('/displayFileFromAPost/:postId').get(displayFileFromAPost);
router.route('/displayFile/:fileId').get(displayFile);
router.route('/getAllPostByType/:type_post_id').get(getAllPostByType);
router.route('/getAllPostByUser/:userId').get(getAllPostByUser);
router.route('/getAllPost').get(getAllPost);
router.use('/react',reactRouter);
module.exports = router;