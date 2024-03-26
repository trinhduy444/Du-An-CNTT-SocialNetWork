const {BadRequestError, NotFoundError} = require('../../utils/response/error.response');
const { getInfoData } = require('../../utils/index');
const { ReactModel,CommentModel,UserModel } = require('../../models/index');

class reactService {
    static async createComment(req, res) {
        try {
            const creator_id = req.user.userId;
            const post_id = req.params.postId;
            const { content } = req.body;
    
            if (!content) {
                throw new BadRequestError('Please fill in all fields');
            }
                const commentCount = await CommentModel.countDocuments({ creator_id , post_id });
    
            if (commentCount >= 4) {
                throw new BadRequestError('You have exceeded the maximum number of comments');
            }
    
            const newComment = new CommentModel({ creator_id, post_id, content });
            await newComment.save();
    
            return getInfoData(newComment, ['_id','content', 'creator_id', 'post_id']);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    

    static async createReactAPost(req, res,react_type) {
        try {
            const creator_id = req.user.userId;
            const post_id = req.params.postId;

            const reactExist = await ReactModel.findOne({creator_id, post_id});
            if(reactExist) {
                if(react_type !== reactExist.react_type) {
                    reactExist.react_type = react_type;
                    await reactExist.save();
                    return getInfoData(reactExist,['_id','post_id','react_type','creator_id','from']);
                } else {
                    await reactExist.deleteOne();
                    return res.status(200).json({ message:'Delete react successfully' })
                }
            }
            else{
                const newReact = new ReactModel({creator_id, post_id, react_type, from: 'post'});
                await newReact.save();
                return getInfoData(newReact,['_id','post_id','react_type','creator_id','from']);
            }
            
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    static async createLikeAPost(req, res) {
        return reactService.createReactAPost(req, res, 'like');
    }
    
    static async createDislikeAPost(req, res) {
        return reactService.createReactAPost(req, res, 'dislike');
    }

    static async createReactAComment(req, res,react_type) {
        try {
            const creator_id = req.user.userId;
            const comment_id = req.params.commentId;

            const reactExist = await ReactModel.findOne({creator_id, comment_id});
            if(reactExist) {
                if(react_type !== reactExist.react_type) {
                    reactExist.react_type = react_type;
                    await reactExist.save();
                    return getInfoData(reactExist,['_id','comment_id','react_type','creator_id','from']);
                } else {
                    await reactExist.deleteOne();
                    res.status(200).json({ message:'Delete react successfully' })
                }
            }
            else{
                const newReact = new ReactModel({creator_id, comment_id, react_type, from: 'comment'});
                await newReact.save();
                return getInfoData(newReact,['_id','comment_id','react_type','creator_id','from']);
            }
            
            
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    static async createLikeAComment(req, res) {
        return reactService.createReactAComment(req, res, 'like');
    }
    
    static async createDislikeAComment(req, res) {
        return reactService.createReactAComment(req, res, 'dislike');
    }

    static async deleteComment(req, res) {
        try{
            const comment_id = req.params.commentId;
            const creator_id = req.user.userId;
            const comment = await CommentModel.findById(comment_id);
            if(!comment) {
                throw new NotFoundError('Comment not found');
            }
            if(comment.creator_id.toString() !== creator_id) {
                throw new BadRequestError('You are not authorized to delete this comment');
            }
            await comment.deleteOne();
            return getInfoData(comment,['_id','content','creator_id','post_id']);
        }catch(error){
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async updateComment(req, res) {
        try{
            const comment_id = req.params.commentId;
            console.log(comment_id);
            const creator_id = req.user.userId;
            const comment = await CommentModel.findById(comment_id);
            if(!comment) {
                throw new NotFoundError('Comment not found');
            }
            if(comment.creator_id.toString() !== creator_id) {
                throw new BadRequestError('You are not authorized to delete this comment');
            }
            const { content } = req.body;
            if (!content) {
                throw new BadRequestError('Please fill in all fields');
            }
            comment.content = content;
            await comment.save();
            return getInfoData(comment,['_id','content','creator_id','post_id']);
        }
        catch(error){
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async getAllCommentFromAPost(req, res) {
        try {
            const postId = req.params.postId;
            let { limit, skip } = req.query;

            limit = parseInt(limit) || 10;
            skip = parseInt(skip) || 0;
    
            const comments = await CommentModel
                .find({ post_id: postId })
                .limit(limit)
                .skip(skip)
                .sort({ createdAt: -1 })
                .populate('creator_id', 'username avatar');
            const totalComments = await CommentModel.countDocuments({ post_id: postId });

            for (let comment of comments) {
                const likeCount = await ReactModel.countDocuments({ comment_id: comment._id, type: 'like' });
                const dislikeCount = await ReactModel.countDocuments({ comment_id: comment._id, type: 'dislike' });
                comment.likeCount = likeCount;
                comment.dislikeCount = dislikeCount;
            }
            return ({ comments, totalComments });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    
}


module.exports = reactService;