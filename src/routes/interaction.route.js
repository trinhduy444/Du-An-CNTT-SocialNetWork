const express = require('express');
const router = express.Router();
const followRouter = require('./follow.route');
const reportRouter = require('./report.route');

router.use('/follow',followRouter);
router.use('/report',reportRouter);

module.exports = router;