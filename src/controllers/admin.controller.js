const { OK,CREATED } = require('../utils/response/success.response');
const postManagementService = require('../services/admin/postManagement.service');
const reportManagementService = require('../services/admin/reportManagement.service');
const accountManagementService = require('../services/admin/accountManagement.service');
const authService = require('../services/access/auth.service');
const createAdmin = async (req, res, next) => {
    new CREATED({
        message: 'Create Admin Successfully',
        metadata: await authService.createAdmin(req, res),
    }).send(res);
}
//Report
const addPostType = async (req, res, next) => {
    new CREATED({
        message: 'Add Post Type Successfully',
        metadata: await postManagementService.addPostType(req, res),
    }).send(res);
}
const addReportType = async (req, res, next) => {
    new CREATED({
        message: 'Add Report Type Successfully',
        metadata: await reportManagementService.addReportType(req, res),
    }).send(res);
}
const getAllRerport = async (req, res, next) => {
    new OK({
        message: 'Get All Report Successfully',
        metadata: await reportManagementService.getAllReport(req, res),
    }).send(res);
}
const getAllReportByCreator = async (req, res, next) => {
    new OK({
        message: 'Get All Report By Creator Successfully',
        metadata: await reportManagementService.getAllReportByCreator(req, res),
    }).send(res);
}
const getAllReportByReported = async (req, res, next) => {
    new OK({
        message: 'Get All Report By Reported Successfully',
        metadata: await reportManagementService.getAllReportByReported(req, res),
    }).send(res);
}
const getAllReportByType = async (req, res, next) => {
    new OK({
        message: 'Get All Report By Type Successfully',
        metadata: await reportManagementService.getAllReportByType(req, res),
    }).send(res);
}
const setViolation = async (req, res, next) => {
    new OK({
        message: 'Set Violation Successfully',
        metadata: await reportManagementService.setViolation(req, res),
    }).send(res);
}
const unViolation = async (req, res, next) => {
    new OK({
        message: 'UnViolation Successfully',
        metadata: await reportManagementService.unViolation(req, res),
    }).send(res);
}
const deleteReport = async (req, res) => {
    new OK({
        message: 'Delete Report Successfully',
        metadata: await reportManagementService.deleteReport(req, res),
    }).send(res);
}
const getReportById = async (req, res) => {
    new OK({
        message: 'Get Report By Id Successfully',
        metadata: await reportManagementService.getReportById(req, res),
    }).send(res);
}
const countReportByDay = async (req, res) => {
    new OK({
        message: 'Count Report By Day Successfully',
        metadata: await reportManagementService.countReportByDay(req, res),
    }).send(res);
}
const countReportByWeek = async (req, res) => {
    new OK({
        message: 'Count Report By Week Successfully',
        metadata: await reportManagementService.countReportByWeek(req, res),
    }).send(res);
}
const countReportByMonth = async (req, res) => {
    new OK({
        message: 'Count Report By Month Successfully',
        metadata: await reportManagementService.countReportByMonth(req, res),
    }).send(res);
}
//Post
const getAllPost = async (req, res) => {
    new OK({
        message: 'Get All Post Successfully',
        metadata: await postManagementService.getAllPost(req, res),
    }).send(res);
}
const getAllPostByStatus = async (req, res) => {
    new OK({
        message: 'Get All Post By Status Successfully',
        metadata: await postManagementService.getAllPostByStatus(req, res),
    }).send(res);
}
const getAllPostByUser = async (req, res) => {
    new OK({
        message: 'Get All Post By User Successfully',
        metadata: await postManagementService.getAllPostByUser(req, res),
    }).send(res);
}
const acceptPost = async (req, res) => {
    new OK({
        message: 'Accept Post Successfully',
        metadata: await postManagementService.acceptPost(req, res),
    }).send(res);
}
const unacceptPost = async (req, res) => {
    new OK({
        message: 'Unaccept Post Successfully',
        metadata: await postManagementService.unacceptPost(req, res),
    }).send(res);
}
const deletePost = async (req, res) => {
    new OK({
        message: 'Delete Post Successfully',
        metadata: await postManagementService.deletePost(req, res),
    }).send(res);
}
const countPostByDay = async (req, res) => {
    new OK({
        message: 'Count Post By Day Successfully',
        metadata: await postManagementService.countPostByDay(req, res),
    }).send(res);
}
const countPostByWeek = async (req, res) => {
    new OK({
        message: 'Count Post By Week Successfully',
        metadata: await postManagementService.countPostByWeek(req, res),
    }).send(res);
}
const countPostByMonth = async (req, res) => {
    new OK({
        message: 'Count Post By Month Successfully',
        metadata: await postManagementService.countPostByMonth(req, res),
    }).send(res);
}
//User
const getAllUser = async (req, res) => {
    new OK({
        message: 'Get All User Successfully',
        metadata: await accountManagementService.getAllUser(req, res),
    }).send(res);
}
const countUserByDay = async (req, res) => {
    new OK({
        message: 'Count User By Day Successfully',
        metadata: await accountManagementService.countUserByDay(req, res),
    }).send(res);
}
const countUserByWeek = async (req, res) => {
    new OK({
        message: 'Count User By Week Successfully',
        metadata: await accountManagementService.countUserByWeek(req, res),
    }).send(res);
}
const countUserByMonth = async (req, res) => {
    new OK({
        message: 'Count User By Month Successfully',
        metadata: await accountManagementService.countUserByMonth(req, res),
    }).send(res);
}
module.exports = {createAdmin,addPostType,addReportType,getAllRerport,getAllReportByCreator,countUserByDay,countPostByDay,countPostByWeek
    ,countUserByMonth,acceptPost,countUserByWeek,getAllPost,getAllPostByStatus,getAllPostByUser,unacceptPost,getAllReportByReported,
    deletePost,getAllReportByType,setViolation,unViolation,getAllUser,getReportById,deleteReport,countPostByMonth,countReportByDay,countReportByWeek,countReportByMonth};

