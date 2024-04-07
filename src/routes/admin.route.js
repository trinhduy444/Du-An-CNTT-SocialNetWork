const express = require('express');
const router = express.Router();
const {authentication,checkAuthIsAdmin} = require('../middleware/auth.middleware');
const {createAdmin,addPostType,addReportType,getAllRerport,getAllReportByCreator,deletePost,getAllPost,
    getAllPostByUser,getAllReportByReported,getAllReportByType,setViolation,unViolation,getReportById,
    getAllPostByStatus,deleteReport,acceptPost,getAllUser,unacceptPost,countUserByDay,countUserByWeek,
    countUserByMonth,countPostByDay,countPostByWeek,countPostByMonth,countReportByDay,countReportByWeek,countReportByMonth} = require('../controllers/admin.controller');
//create Admin
router.route('/createAdmin').post(authentication,checkAuthIsAdmin,createAdmin);
// Post 
router.route('/addPostType').post(authentication,checkAuthIsAdmin,addPostType);
router.route('/deletePost/:postId').post(authentication,checkAuthIsAdmin,deletePost);
router.route('/getAllPost').post(authentication,checkAuthIsAdmin,getAllPost);
router.route('/getAllPostByStatus').post(authentication,checkAuthIsAdmin,getAllPostByStatus);
router.route('/countPostByDay').post(authentication,checkAuthIsAdmin,countPostByDay);
router.route('/countPostByWeek').post(authentication,checkAuthIsAdmin,countPostByWeek);
router.route('/countPostByMonth').post(authentication,checkAuthIsAdmin,countPostByMonth);
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
router.route('/unViolation/:reportId').post(authentication,checkAuthIsAdmin,unViolation);
router.route('/getReportById/:reportId').post(authentication,checkAuthIsAdmin,getReportById);
router.route('/deleteReport/:reportId').post(authentication,checkAuthIsAdmin,deleteReport);
router.route('/countReportByDay').post(authentication,checkAuthIsAdmin,countReportByDay);
router.route('/countReportByWeek').post(authentication,checkAuthIsAdmin,countReportByWeek);
router.route('/countReportByMonth').post(authentication,checkAuthIsAdmin,countReportByMonth);
// User
router.route('/getAllUser').post(authentication,checkAuthIsAdmin,getAllUser);
router.route('/countUserByDay').post(authentication,checkAuthIsAdmin,countUserByDay);
router.route('/countUserByWeek').post(authentication,checkAuthIsAdmin,countUserByWeek);
router.route('/countUserByMonth').post(authentication,checkAuthIsAdmin,countUserByMonth);
module.exports = router;