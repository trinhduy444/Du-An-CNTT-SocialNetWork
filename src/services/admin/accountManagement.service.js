const {UserModel,PostModel} = require('../../models/index');
const {BadRequestError,NotFoundError,UnauthenticatedError} = require('../../utils/response/error.response');
const { getInfoData } = require('../../utils/index');
const { getGridBucket } = require('../../middleware/multer.middleware');
const moment = require('moment');

class accountManagement {
    static async getAllUser(req, res, next) {
        try {
            const permission = req.user.permission;
            let { limit, skip } = req.query;
            limit = parseInt(limit) || 7;
            skip = parseInt(skip) || 0;
            if (permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            const users = await UserModel.find({ permission: 'user' }).limit(limit).skip(skip);
    
            const usersWithPostCount = await Promise.all(users.map(async (user) => {
                const postCount = await PostModel.countDocuments({ user_id: user._id });
                return { ...user.toObject(), postCount }; 
            }));
    
            return usersWithPostCount;
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
  
    static async countUserByDay(req, res, next) {
        try {
            const permission = req.user.permission;
            if (permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(startOfWeek.getDate() - today.getDay() + 1); 
    
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6); 
    
            const userCountByDay = {
                Monday: 0,
                Tuesday: 0,
                Wednesday: 0,
                Thursday: 0,
                Friday: 0,
                Saturday: 0,
                Sunday: 0
            };
    
            const users = await UserModel.find({
                createdAt: { $gte: startOfWeek, $lte: endOfWeek },
                permission: 'user'
            });
    
            users.forEach(user => {
                const dayOfWeek = user.createdAt.getDay();
                switch (dayOfWeek) {
                    case 1:
                        userCountByDay.Monday++;
                        break;
                    case 2:
                        userCountByDay.Tuesday++;
                        break;
                    case 3:
                        userCountByDay.Wednesday++;
                        break;
                    case 4:
                        userCountByDay.Thursday++;
                        break;
                    case 5:
                        userCountByDay.Friday++;
                        break;
                    case 6:
                        userCountByDay.Saturday++;
                        break;
                    case 0:
                        userCountByDay.Sunday++;
                        break;
                    default:
                        break;
                }
            });
    
            const result = Object.entries(userCountByDay).map(([day, count]) => ({ day, count }));
            return result;
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
        
    }
    static async countUserByWeek(req, res, next) {
        try {
            const permission = req.user.permission;
            if (permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth();
            const startDate = new Date(year, month, 1); 
            const endDate = new Date(year, month + 1, 0); 
    
            const numWeeks = Math.ceil((endDate.getDate() - startDate.getDate() + 1) / 7);
    
            const userCountByWeek = {};
            for (let week = 1; week <= numWeeks; week++) {
                userCountByWeek[`Week ${week}`] = 0;
            }
    
            const users = await UserModel.find({
                createdAt: { $gte: startDate, $lte: endDate },
                permission: 'user'
            });
    
            users.forEach(user => {
                const startWeek = startDate.getDate() + (user.createdAt.getDay() - startDate.getDay());
                const weekNumber = Math.ceil((startWeek - startDate.getDate()) / 7);
                userCountByWeek[`Week ${weekNumber}`]++;
            });
    
            const result = Object.entries(userCountByWeek).map(([week, count]) => ({ week, count }));
            return result;
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    static async countUserByMonth(req, res, next) {
        try {
            const permission = req.user.permission;
            if (permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
    
            const today = new Date();
            const year = today.getFullYear();
    
            const userCountByMonth = {};
            for (let month = 0; month < 12; month++) {
                userCountByMonth[`${month + 1}`] = 0;
            }
    
            const users = await UserModel.find({
                createdAt: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31) },
                permission: 'user'
            });
    
            users.forEach(user => {
                const month = user.createdAt.getMonth();
                userCountByMonth[`${month + 1}`]++;
            });
    
            const result = Object.entries(userCountByMonth).map(([month, count]) => ({ month, count }));
            return result;
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    
    
    
    // static async deleteUserByID(req,res){
    //     try {
    //         const permission = req.user.permission;
    //         if (permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
    //         const user_id = req.params.userId;
    //         const user = await UserModel.findById(id);
    //         if(!user) throw new NotFoundError("User not found");

    //         await user.deleteOne();
    //         return user;
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }
    // }
}

module.exports = accountManagement;
