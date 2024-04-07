const {PostTypeModel,PostModel,ReactModel,CommentModel} = require('../../models/index');
const {BadRequestError,NotFoundError,UnauthenticatedError} = require('../../utils/response/error.response');
const { getInfoData } = require('../../utils/index');
const { getGridBucket } = require('../../middleware/multer.middleware');
const mongoose = require('mongoose');

class postManagementService {
    static async addPostType(req, res) {
        
            const permission = req.user.permission;
            if (permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");

            const {name} = req.body;
            if (!name) throw new NotFoundError('Name is required');

            const nameExist = await PostTypeModel.findOne({name});
            if(nameExist) throw new BadRequestError("Name is Exist");
            
            const admin_id_created = req.user.userId;
            const postType = new PostTypeModel({name, admin_id_created});
            await postType.save();
            return postType;
    }

    static async getAllPostByStatus(req, res){
        try {
            const permission = req.user.permission;
            if (permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            const status = req.body.status;
            let { limit, skip } = req.query;

            limit = parseInt(limit) || 5;
            skip = parseInt(skip) || 0;
    
            const posts = await PostModel
                .find({status: status})
                .limit(limit)
                .skip(skip)
                .populate('user_id', 'username')
                .populate('type_post_id', 'name');
    
            const formattedPosts = await Promise.all(posts.map(async (post) => {
                const { _id, user_id, title, advertisement_id, type_post_id, content, address, website, image, video,status, createdAt, updatedAt } = post;
                    
                const likeCount = await ReactModel.countDocuments({ post_id: _id, react_type: 'like' });
                const dislikeCount = await ReactModel.countDocuments({ post_id: _id, react_type: 'dislike' });
                const commentsCount = await CommentModel.countDocuments({ post_id: _id});
                return {
                    _id,
                    user_id,
                    title,
                    advertisement_id,
                    type_post_id,
                    content,
                    address,
                    website,
                    image,
                    video,
                    status,
                    createdAt,
                    updatedAt,
                    likeCount,
                    username: post.user_id.username,
                    user_id: post.user_id._id,
                    dislikeCount,
                    commentsCount
                };
                
 
            }));
    
            return formattedPosts;
        } catch(error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    static async getAllPost(req, res){
        try {
            const permission = req.user.permission;
            if (permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            let { limit, skip } = req.query;

            limit = parseInt(limit) || 5;
            skip = parseInt(skip) || 0;
    
            const posts = await PostModel
                .find()
                .limit(limit)
                .skip(skip)
                .populate('user_id', 'username')
                .populate('type_post_id', 'name');
    
            const formattedPosts = await Promise.all(posts.map(async (post) => {
                const { _id, user_id, title, advertisement_id, type_post_id, content, address, website, image, video,status, createdAt, updatedAt } = post;
                    
                const likeCount = await ReactModel.countDocuments({ post_id: _id, react_type: 'like' });
                const dislikeCount = await ReactModel.countDocuments({ post_id: _id, react_type: 'dislike' });
                const commentsCount = await CommentModel.countDocuments({ post_id: _id});
                return {
                    _id,
                    user_id,
                    title,
                    advertisement_id,
                    type_post_id,
                    content,
                    address,
                    website,
                    image,
                    video,
                    status,
                    createdAt,
                    updatedAt,
                    likeCount,
                    username: post.user_id.username,
                    user_id: post.user_id._id,
                    dislikeCount,
                    commentsCount
                };
                
 
            }));
    
            return formattedPosts;
        } catch(error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    static async acceptPost(req, res){
        try{
            const permission = req.user.permission;
            if (permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            const postId = req.params.postId;
            const post = await PostModel.findById(postId);
            if (!post) throw new NotFoundError('Post not found');
            post.status = "approved";
            await post.save();
            return getInfoData(post,["_id","status"]);
        }catch(error){
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    static async unacceptPost(req, res){
        try{
            const permission = req.user.permission;
            if (permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            const postId = req.params.postId;
            const post = await PostModel.findById(postId);
            if (!post) throw new NotFoundError('Post not found');
            post.status = "rejected";
            await post.save();
            return getInfoData(post,["_id","status"]);
        }catch(error){
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    static async deletePost(req, res){
        try {
            const permission = req.user.permission;
            if (permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");

            const postId = new mongoose.Types.ObjectId(req.params.postId);
            const post = await PostModel.findById(postId);
            if(!post) throw new NotFoundError("Post not found");

            await post.deleteOne();
            const gridBucket = getGridBucket();
            if (post.image && post.image.length > 0) {
                for (const imageId of post.image) {
                    const imageFile = await gridBucket.find({ _id: imageId }).toArray();
                    if (imageFile.length > 0) {
                        await gridBucket.delete(imageFile[0]._id);
                    }
                }
            }

            if (post.video && post.video.length > 0) {
                for (const videoId of post.video) {
                    const videoFile = await gridBucket.find({ _id: videoId }).toArray();
                    if (videoFile.length > 0) {
                        await gridBucket.delete(videoFile[0]._id);
                    }
                }
            }
            // 
            await ReactModel.deleteMany({ post_id: postId });
            const comments = await CommentModel.find({ post_id: postId });
            for (const comment of comments) {
                await ReactModel.deleteMany({ comment_id: comment._id });
            }
            
            await CommentModel.deleteMany({ post_id: postId });
            
            return getInfoData(post, ["_id", "title", "type_post_id", "content", "user_id", "website","address", "image", "video"]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    
    static async getAllPostByUser(req,res){
        try{
            const user_id = new mongoose.Types.ObjectId(req.params.userId);
            let { limit, skip } = req.query;

            limit = parseInt(limit) || 5;
            skip = parseInt(skip) || 0;
            
            const posts = await PostModel
                .find({ user_id })
                .limit(limit)
                .skip(skip)
                .sort({ createdAt: -1 }); 
            return posts.map(post => getInfoData(post,['_id','user_id','title','advertisement_id','type_post_id','content',
            'address','website','image','video','createdAt','updatedAt']));
        }catch(error){
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    static async countPostByDay(req, res, next) {
        try {
            const permission = req.user.permission;
            if (permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(startOfWeek.getDate() - today.getDay() + 1); 
    
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6); 
    
            const postCountByDay = {
                Monday: 0,
                Tuesday: 0,
                Wednesday: 0,
                Thursday: 0,
                Friday: 0,
                Saturday: 0,
                Sunday: 0
            };
    
            const posts = await PostModel.find({
                createdAt: { $gte: startOfWeek, $lte: endOfWeek },
                status: 'approved'
            });
    
            posts.forEach(post => {
                const dayOfWeek = post.createdAt.getDay();
                switch (dayOfWeek) {
                    case 1:
                        postCountByDay.Monday++;
                        break;
                    case 2:
                        postCountByDay.Tuesday++;
                        break;
                    case 3:
                        postCountByDay.Wednesday++;
                        break;
                    case 4:
                        postCountByDay.Thursday++;
                        break;
                    case 5:
                        postCountByDay.Friday++;
                        break;
                    case 6:
                        postCountByDay.Saturday++;
                        break;
                    case 0:
                        postCountByDay.Sunday++;
                        break;
                    default:
                        break;
                }
            });
    
            const result = Object.entries(postCountByDay).map(([day, count]) => ({ day, count }));
            return result;
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async countPostByWeek(req, res, next) {
        try {
            const permission = req.user.permission;
            if (permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
            
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth();
            const startDate = new Date(year, month, 1); 
            const endDate = new Date(year, month + 1, 0); 
    
            const numWeeks = Math.ceil((endDate.getDate() - startDate.getDate() + 1) / 7);
    
            const postCountByWeek = {};
            for (let week = 1; week <= numWeeks; week++) {
                postCountByWeek[`Week ${week}`] = 0;
            }
    
            const posts = await PostModel.find({
                createdAt: { $gte: startDate, $lte: endDate },
                status: 'approved'
            });
    
            posts.forEach(post => {
                const startWeek = startDate.getDate() + (post.createdAt.getDay() - startDate.getDay());
                const weekNumber = Math.ceil((startWeek - startDate.getDate()) / 7);
                postCountByWeek[`Week ${weekNumber}`]++;
            });
    
            const result = Object.entries(postCountByWeek).map(([week, count]) => ({ week, count }));
            return result;
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async countPostByMonth(req, res, next) {
        try {
            const permission = req.user.permission;
            if (permission !== 'admin') throw new UnauthenticatedError("You can't access here, don't have permission");
    
            const today = new Date();
            const year = today.getFullYear();
    
            const postCountByMonth = {};
            for (let month = 0; month < 12; month++) {
                postCountByMonth[`${month + 1}`] = 0;
            }
    
            const posts = await PostModel.find({
                createdAt: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31) },
                status: 'approved'
            });
    
            posts.forEach(post => {
                const month = post.createdAt.getMonth();
                postCountByMonth[`${month + 1}`]++;
            });
    
            const result = Object.entries(postCountByMonth).map(([month, count]) => ({ month, count }));
            return result;
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    
    
}

module.exports = postManagementService;
