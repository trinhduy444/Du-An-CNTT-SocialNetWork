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
