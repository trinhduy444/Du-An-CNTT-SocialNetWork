const {ReportTypeModel, ReportModel,MessageModel} = require('../../models/index');
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

            if(user.permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            else{
                const reports = await ReportModel.find();
                return reports;
            }
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
            const {message,violation} = req.body;
            if(user.permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            else{
                const report = await ReportModel.findById(reportId);
                if(!report) throw new NotFoundError('Report not found');
                
                if(message){
                    const sender_id = req.user.userId;
                    const receiver_id = report.creator_id;
                    const content = message;
                    const newMessage = new MessageModel({sender_id, receiver_id, content});
                    await newMessage.save();
                    console.log(newMessage._id);
                    report.messages = newMessage._id;
                }
                console.log(report.messages)
                report.violation = violation;
                await report.save();
                return report;
            }
        }
        catch(err){
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
}

module.exports = reportManagementService;