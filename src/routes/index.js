const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const bodyParserMiddleware = require('../middleware/bodyParser.middleware');
router.use(bodyParserMiddleware());
const {authentication,checkAuthIsAdmin} = require('../middleware/auth.middleware');

// Your other routes and middleware go here

module.exports = router;

// khai bao router
const userRouter = require('./user.route');
const authRouter = require('./auth.route');
const adminRouter = require('./admin.route');
const postRouter = require('./post.route');
const interactionRouter = require('./interaction.route');

router.use("/api/v1/user",userRouter);
router.use("/api/v1/auth",authRouter);
router.use("/api/v1/admin",authentication,checkAuthIsAdmin, adminRouter);
router.use("/api/v1/post",postRouter);
router.use("/api/v1/interaction",interactionRouter);

module.exports = router;