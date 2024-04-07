const {ReportTypeModel, PostModel,ReportModel,CommentModel,MessageModel} = require('../../models/index');
const {BadRequestError,NotFoundError,UnauthenticatedError} = require('../../utils/response/error.response');
const { getInfoData } = require('../../utils/index');
const mongoose = require('mongoose');
const { getGridBucket } = require('../../middleware/multer.middleware');

class reportManagementService {
    static async addReportType(req, res) {
        
            const permission = req.user.permission;
            if (permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");

            const {name,report_from} = req.body;
            if (!name || !report_from) throw new NotFoundError('Please fill in all fields');

            const nameExist = await ReportTypeModel.findOne({name});
            if(nameExist) throw new BadRequestError("Name is Exist");
            
            const admin_id_created = req.user.userId;
            const reportType = new ReportTypeModel({name, report_from,admin_id_created});
            await reportType.save();
            return reportType;
    }

    static async getAllReport(req, res) {
        try{
            const user = req.user;
            let { limit, skip } = req.query;
            limit = parseInt(limit) || 7;
            skip = parseInt(skip) || 0;
            if(user.permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            const reports = await ReportModel
                .find()
                .limit(limit)
                .skip(skip)
                .populate('creator_id', 'username')
                .populate('reported_user_id', 'username')
                .populate('report_type_id', 'name report_from')
                .populate('administrator_id', 'username');

            return reports;
            
        }catch(err){
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    
    static async getAllReportByCreator(req, res) {
        try{
            const user = req.user;
            const creator_id = req.params.creatorId;
            if(user.permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            else{
                const reports = await ReportModel.find({creator_id});
                return reports;
            }
        }catch(err){
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async getAllReportByReported(req, res) {
        try{
            const user = req.user;
            const reported_user_id = req.params.reportedId;
            if(user.permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            else{
                const reports = await ReportModel.find({reported_user_id});
                return reports;
            }
        }catch(err){
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    

    static async getAllReportByType(req, res) {
        try{
            const user = req.user;
            const report_type_id = req.body.report_type_id;
            if(user.permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            else{
                const reports = await ReportModel.find({report_type_id});
                return reports;
            }
        }catch(err){
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async setViolation(req, res) {
        try{
            const user = req.user;
            const reportId = req.params.reportId;
            // const {message,violation} = req.body;
            if(user.permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            
            const report = await ReportModel.findById(reportId);
            if(!report) throw new NotFoundError('Report not found');
            if(report.post_id){
                const post = await PostModel.findById(report.post_id);
                if(!post) throw new NotFoundError('Post not found');
                post.status = 'rejected'
                await post.save();
            }else if(report.comment_id){
                const comment = await CommentModel.findById(report.comment_id);
                if(!comment) throw new NotFoundError('Comment not found');
                comment.status = 'hide';
                await comment.save();
            }
            
            report.administrator_id = user.userId;
            report.violation = true;
            report.status = 'reviewed';
            await report.save();
            return report;
        }
        catch(err){
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async unViolation(req, res) {
        try {
            const user = req.user;
            const reportId = req.params.reportId;
            if (user.permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
    
            const report = await ReportModel.findById(reportId);
            if (!report) throw new NotFoundError('Report not found');
    
            if (report.post_id) {
                const post = await PostModel.findById(report.post_id);
                if (!post) throw new NotFoundError('Post not found');
                post.status = 'approved'; // Đặt lại trạng thái của bài viết
                await post.save();
            } else if (report.comment_id) {
                const comment = await CommentModel.findById(report.comment_id);
                if (!comment) throw new NotFoundError('Comment not found');
                comment.status = 'active'; // Đặt lại trạng thái của bình luận
                await comment.save();
            }
    
            report.administrator_id = user.userId;
            report.violation = false; // Gỡ bỏ đánh dấu vi phạm
            report.status = 'reviewed';
            await report.save();
            
            return report;
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    

    static async getReportById (req,res){
        try{
            const user = req.user;
            const reportId = req.params.reportId;
            if(user.permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            else{
                const report = await ReportModel.findById(reportId);
                report.status = 'viewed';
                if(!report) throw new NotFoundError('Report not found');
                return report;
            }
        }
        catch(err){
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async deleteReport(req, res){
        try{
            const user = req.user;
            const reportId = req.params.reportId;
            if(user.permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            else{
                const report = await ReportModel.findById(reportId);
                if(!report) throw new NotFoundError('Report not found');
                const gridBucket = getGridBucket();
                if (report.image && report.image.length > 0) {
                    for (const imageId of report.image) {
                        const imageFile = await gridBucket.find({ _id: imageId }).toArray();
                        if (imageFile.length > 0) {
                            await gridBucket.delete(imageFile[0]._id);
                        }
                    }
                }
                await report.deleteOne();
                return report;
            }
        }
        catch(err){
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    static async countReportByDay(req, res, next) {
        try {
            const permission = req.user.permission;
            if (permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(startOfWeek.getDate() - today.getDay() + 1); 
    
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6); 
    
            const reportCountByDay = {
                Monday: 0,
                Tuesday: 0,
                Wednesday: 0,
                Thursday: 0,
                Friday: 0,
                Saturday: 0,
                Sunday: 0
            };
    
            const reports = await ReportModel.find({
                createdAt: { $gte: startOfWeek, $lte: endOfWeek }
            });
    
            reports.forEach(report => {
                const dayOfWeek = report.createdAt.getDay();
                switch (dayOfWeek) {
                    case 1:
                        reportCountByDay.Monday++;
                        break;
                    case 2:
                        reportCountByDay.Tuesday++;
                        break;
                    case 3:
                        reportCountByDay.Wednesday++;
                        break;
                    case 4:
                        reportCountByDay.Thursday++;
                        break;
                    case 5:
                        reportCountByDay.Friday++;
                        break;
                    case 6:
                        reportCountByDay.Saturday++;
                        break;
                    case 0:
                        reportCountByDay.Sunday++;
                        break;
                    default:
                        break;
                }
            });
    
            const result = Object.entries(reportCountByDay).map(([day, count]) => ({ day, count }));
            return result;
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    static async countReportByWeek(req, res, next) {
        try {
            const permission = req.user.permission;
            if (permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth();
            const startDate = new Date(year, month, 1); 
            const endDate = new Date(year, month + 1, 0); 
    
            const numWeeks = Math.ceil((endDate.getDate() - startDate.getDate() + 1) / 7);
    
            const reportCountByWeek = {};
            for (let week = 1; week <= numWeeks; week++) {
                reportCountByWeek[`Week ${week}`] = 0;
            }
    
            const reports = await ReportModel.find({
                createdAt: { $gte: startDate, $lte: endDate }
            });
    
            reports.forEach(report => {
                const startWeek = startDate.getDate() + (report.createdAt.getDay() - startDate.getDay());
                const weekNumber = Math.ceil((startWeek - startDate.getDate()) / 7);
                reportCountByWeek[`Week ${weekNumber}`]++;
            });
    
            const result = Object.entries(reportCountByWeek).map(([week, count]) => ({ week, count }));
            return result;
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    static async countReportByMonth(req, res, next) {
        try {
            const permission = req.user.permission;
            if (permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
    
            const today = new Date();
            const year = today.getFullYear();
    
            const reportCountByMonth = {};
            for (let month = 0; month < 12; month++) {
                reportCountByMonth[`${month + 1}`] = 0;
            }
    
            const reports = await ReportModel.find({
                createdAt: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31) }
            });
    
            reports.forEach(report => {
                const month = report.createdAt.getMonth();
                reportCountByMonth[`${month + 1}`]++;
            });
    
            const result = Object.entries(reportCountByMonth).map(([month, count]) => ({ month, count }));
            return result;
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    
    
}

module.exports = reportManagementService;