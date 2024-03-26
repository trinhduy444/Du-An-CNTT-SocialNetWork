const {BadRequestError, NotFoundError} = require('../../utils/response/error.response');
const { FollowModel,ReportTypeModel,ReportModel,MessageModel } = require('../../models/index');
const { getInfoData } = require('../../utils/index');
const mongoose = require('mongoose');
const { getGridBucket } = require('../../middleware/multer.middleware');

class interactionService {
//----------------------------------------------------------------Follow----------------------------------------------------------------

    static async follow(req, res) {
        try {
            const follower_id = req.user.userId;
            const followed_id = req.params.followedId;

            const followExist = await FollowModel.findOne({follower_id, followed_id});
            if(followExist) throw new BadRequestError('You have already followed this user');

            // console.log("Nguoi theo doi: "+follower_id+ " Nguoi duoc theo doi: "+followed_id);

            const newFollow = new FollowModel({follower_id, followed_id});
            await newFollow.save();
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async unFollow(req, res) {
        try{
            const follower_id = req.user.userId;
            const followed_id = req.params.followedId;

            const followExist = await FollowModel.findOne({follower_id, followed_id});
        if(followExist){
            await FollowModel.deleteOne({ follower_id, followed_id });
        }
        else throw new BadRequestError('You have already unfollowed this user');
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async getAllFollowers(req, res) {
        try{
            const followed_id = req.user.userId;
            const followers = await FollowModel.find({followed_id}).populate('follower_id','username');
            const numberOfFollowers = followers.length;
            return {numberOfFollowers,followers};
        }catch(err){
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async getAllFollowersById(req, res) {
        try{
            const followed_id = req.params.followed_id;
            
            const followers = await FollowModel.find({followed_id}).populate('follower_id','username');
            const numberOfFollowers = followers.length;
            return {numberOfFollowers,followers};
        }catch(err){
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async getAllFolloweds(req,res){
        try{
            const follower_id = req.user.userId;
            const followeds = await FollowModel.find({follower_id}).populate('followed_id','username');
            const numberOfFolloweds = followeds.length;
            return {numberOfFolloweds,followeds};
        }catch(error){
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async getAllFollowedsById(req,res){
        try{
            const follower_id = req.params.follower_id;
            const followeds = await FollowModel.find({follower_id}).populate('followed_id','username');
            const numberOfFolloweds = followeds.length;
            return {numberOfFolloweds,followeds};
        }catch(error){
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async getAllReportTypes(req,res){
        try{
            const reportTypes = await ReportTypeModel.find().select('name report_from');
            return reportTypes;
        }catch(error){
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    static async checkFollow(req,res){
        try{
            const follower_id =  req.query.follower_id;
            if(!follower_id) throw new BadRequestError('follower_id is required');
            const followed_id = req.params.followedId;
            const followExist = await FollowModel.findOne({follower_id, followed_id});
            
            if(followExist) return true;
            
            return false;

        }
        catch(error){
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
//----------------------------------------------------------------Report----------------------------------------------------------------
    static async createReport(req,res){
        try{
            const {report_type_id,post_id,content} = req.body;
            const reported_user_id = req.params.reported_user_id;
            const creator_id = req.user.userId;

            const newReport = new ReportModel({report_type_id,reported_user_id,creator_id,post_id,content});
            // console.log(req.files)
            const imageIds = req.files.map(file => file.id);

            newReport.image = imageIds;

            await newReport.save();
            return getInfoData(newReport,["report_type_id","reported_user_id","creator_id","post_id","content","status","image"]);
        }catch(error){
            console.log(error);
            res.status(500).json({ message: "Internal Server Error"})
        }
    }
    
    static async viewAllReport(req,res){
        try{
            const creator_id = req.user.userId;

            const reports = await ReportModel.find({ creator_id }).select("report_type_id reported_user_id creator_id post_id content status violation image");
            return reports;
        }catch(error){
            console.log(error);
            res.status(500).json({ message: "Internal Server Error"})
        }
    }
    static async viewMessageFromReport(req,res){
        try{
            const reportId = req.params.reportId;
            const creator_id = req.user.userId;
            const report = await ReportModel.findById(reportId).select('messages creator_id');
            console.log(report);
            console.log(report.creator_id)
            if(report.creator_id != creator_id) throw new BadRequestError("You don't have permission to view this report");
            const messages = await MessageModel.find({_id: {$in: report.messages}});
            for (const message of messages) {
                message.status = 'viewed';
                await message.save(); 
            }
            return messages;
        }catch(error){
            console.log(error);
            res.status(500).json({ message: "Internal Server Error"})
        }
    }
}
module.exports = interactionService;