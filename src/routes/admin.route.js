const express = require('express');
const router = express.Router();
const {authentication,checkAuthIsAdmin} = require('../middleware/auth.middleware');
const {addPostType,addReportType,getAllRerport,getAllReportByCreator,deletePost,getAllPost,
    getAllPostByUser,getAllReportByReported,getAllReportByType,setViolation,getReportById,deleteReport,acceptPost,getAllUser,unacceptPost} = require('../controllers/admin.controller');
// Post 
router.route('/addPostType').post(authentication,checkAuthIsAdmin,addPostType);
router.route('/deletePost/:postId').post(authentication,checkAuthIsAdmin,deletePost);
router.route('/getAllPost').post(authentication,checkAuthIsAdmin,getAllPost);
router.route('/getAllPostByUser/:userId').post(authentication,checkAuthIsAdmin,getAllPostByUser);
router.route('/acceptPost/:postId').post(authentication,checkAuthIsAdmin,acceptPost);
router.route('/unacceptPost/:postId').post(authentication,checkAuthIsAdmin,unacceptPost);

// Report
router.route('/addReportType').post(authentication,checkAuthIsAdmin,addReportType);
router.route('/getAllRerport').post(authentication,checkAuthIsAdmin,getAllRerport);
router.route('/getAllReportByCreator/:creatorId').post(authentication,checkAuthIsAdmin,getAllReportByCreator);
router.route('/getAllReportByReported/:reportedId').post(authentication,checkAuthIsAdmin,getAllReportByReported);
router.route('/getAllReportByType').post(authentication,checkAuthIsAdmin,getAllReportByType);
router.route('/setViolation/:reportId').post(authentication,checkAuthIsAdmin,setViolation);
router.route('/getReportById/:reportId').post(authentication,checkAuthIsAdmin,getReportById);
router.route('/deleteReport/:reportId').post(authentication,checkAuthIsAdmin,deleteReport);
// User
router.route('/getAllUser').post(authentication,checkAuthIsAdmin,getAllUser);
module.exports = router;