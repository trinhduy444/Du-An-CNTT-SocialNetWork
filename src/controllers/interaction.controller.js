const { OK,CREATED } = require('../utils/response/success.response');
const interactionService = require('../services/user/interaction.service');
//follow
const follow = async (req, res) =>{
    new CREATED({
        message: 'Follow Successfully',
        metadata: await interactionService.follow(req, res),
    }).send(res);
}
const unFollow = async (req, res) =>{
    new OK({
        message: 'Unfollow Successfully',
        metadata: await interactionService.unFollow(req, res),
    }).send(res);
}
const getAllFollowers = async (req, res) =>{
    new OK({
        message: 'Get All Followers Successfully',
        metadata: await interactionService.getAllFollowers(req, res),
    }).send(res);
}
const getAllFollowersById = async (req, res) =>{
    new OK({
        message: 'Get All Followers By Id Successfully',
        metadata: await interactionService.getAllFollowersById(req, res),
    }).send(res);
}
const getAllFolloweds = async (req, res) =>{
    new OK({
        message: 'Get All Followeds Successfully',
        metadata: await interactionService.getAllFolloweds(req, res),
    }).send(res);
}
const getAllFollowedsById = async (req, res) =>{
    new OK({
        message: 'Get All Followeds By Id Successfully',
        metadata: await interactionService.getAllFollowedsById(req, res),
    }).send(res);
}
//report
const getAllReportTypes = async (req, res) =>{
    new OK({
        message: 'Get All Report Types Successfully',
        metadata: await interactionService.getAllReportTypes(req, res),
    }).send(res);
}
const createReport = async (req, res) =>{
    new CREATED({
        message: 'Report Successfully',
        metadata: await interactionService.createReport(req, res),
    }).send(res);
}
const viewAllReport = async (req, res) =>{
    new OK({
        message: 'View All Report Successfully',
        metadata: await interactionService.viewAllReport(req, res),
    }).send(res);
}
const viewMessageFromReport = async (req, res) =>{
    new OK({
        message: 'View Message From Report Successfully',
        metadata: await interactionService.viewMessageFromReport(req, res),
    }).send(res);
}
const checkFollow = async (req, res) =>{
    new OK({
        message: 'Check Follow Successfully',
        metadata: await interactionService.checkFollow(req, res),
    }).send(res);
}
module.exports = {follow,unFollow,getAllFollowers,getAllFollowersById,getAllFolloweds,getAllFollowedsById,getAllReportTypes,createReport,checkFollow,viewAllReport,viewMessageFromReport};