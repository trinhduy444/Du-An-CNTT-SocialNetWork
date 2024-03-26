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
}

module.exports = postManagementService;
