const { OK,CREATED } = require('../utils/response/success.response');
const postManagementService = require('../services/admin/postManagement.service');
const reportManagementService = require('../services/admin/reportManagement.service');
const accountManagementService = require('../services/admin/accountManagement.service');
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
const getAllPost = async (req, res) => {
    new OK({
        message: 'Get All Post Successfully',
        metadata: await postManagementService.getAllPost(req, res),
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
//User
const getAllUser = async (req, res) => {
    new OK({
        message: 'Get All User Successfully',
        metadata: await accountManagementService.getAllUser(req, res),
    }).send(res);
}
module.exports = {addPostType,addReportType,getAllRerport,getAllReportByCreator,acceptPost,getAllPost,getAllPostByUser,unacceptPost,getAllReportByReported,deletePost,getAllReportByType,setViolation,getAllUser,getReportById,deleteReport}

