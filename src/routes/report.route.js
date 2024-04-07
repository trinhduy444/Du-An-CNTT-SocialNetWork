const express = require('express');
const router = express.Router();
const {authentication} = require('../middleware/auth.middleware');
const {getAllReportTypes,createReport,viewAllReport,viewMessageFromReport} = require('../controllers/interaction.controller');
const {getAllRerport} = require('../controllers/admin.controller');
const {upload} = require('../middleware/multer.middleware');


router.route('/getAllReportTypes').post(authentication,getAllReportTypes);
router.route('/createReport/:reported_user_id').post(authentication,upload.array('image', 4),createReport);
router.route('/viewAllReport').post(authentication,viewAllReport);
router.route('/viewMessageFromReport/:reportId').post(authentication,viewMessageFromReport);
module.exports = router;