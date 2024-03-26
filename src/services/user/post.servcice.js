const {BadRequestError, NotFoundError} = require('../../utils/response/error.response');
const { getInfoData } = require('../../utils/index');
const {PostTypeModel, PostModel,CommentModel,ReactModel} = require('../../models/index');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { getGridBucket } = require('../../middleware/multer.middleware');

class postService{
    /*
        1. slelect Name all Post Types
        2. return them
    */
    static async getAllPostType(req, res){
        try {
            const postTypes = await PostTypeModel.find().select('name');
            return postTypes;
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    /*
        1. Get the information from body of the request
        2. Check login by userId from header
        3. Check chose a type post
        4. Check enough information for the post
        5. Save the post to database
    */
    static async createPost(req, res){
        try {
            const { title, type_post_id, content, address, website } = req.body;
            // console.log("body: " + JSON.stringify(req.body));
            const user_id = req.user.userId;
            if(!user_id) throw new BadRequestError("User not logged in");

            if(!type_post_id) throw new BadRequestError("Please chose a type post");

            if(!content || ! title) throw new BadRequestError("Please provide enough information for the post");
            const images = req.files['image'] ? req.files['image'].map(image => image.id) : [];
            const video = req.files['video'] ? req.files['video'].map(video => video.id) : [];
        
            // console.log("video ", + video);
            const post = new PostModel({
                title, type_post_id, content, user_id, address,website, image:images , video
            });
    
            await post.save();
    
            return getInfoData(post, ["_id", "title", "type_post_id", "content", "user_id", "website","address", "image", "video"]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    /*
        1. get Post Id from parameters
        2. Find the post by Id and select address and website
        3. Check the post is exist
        4. return address and website

    */
    static async openDetail(req, res){
        try {
            // console.log(req.params.postId);
            const postId = new mongoose.Types.ObjectId(req.params.postId);
            const post = await PostModel.findById(postId).select('address website');
            // console.log(post);
            if (!post) {
              throw new BadRequestError('Post not found');
            }
            return getInfoData(post,["address","website"]);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
          }
    }

    /*
        1. check login and get the user id from header
        2. find post by postId from the parameters
        3. check post userId is matching userId from header
        4. delete the post and use Gridbucket delete Files of the post
    */
    static async deletePost(req, res){
        try {
            const user_id = req.user.userId;
            if(!user_id) throw new BadRequestError("User not logged in");

            const postId = new mongoose.Types.ObjectId(req.params.postId);
            const post = await PostModel.findById(postId);
            if(!post) throw new NotFoundError("Post not found");

            if(post.user_id != user_id) throw new BadRequestError("You are not allowed to delete this post");
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
    
    static async getPost(req, res){
        try{
            const post_id = new mongoose.Types.ObjectId(req.params.postId);
            const post = await PostModel.findById(post_id);
            if(!post) throw new NotFoundError("No post found");
            
            return getInfoData(post, ["_id", "title", "type_post_id", "content", "user_id", "website","address", "image", "video"]);

        }catch(error){
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async editPost(req, res){
       try{
            const user_id = req.user.userId;
            const post_id = new mongoose.Types.ObjectId(req.params.postId);
            
            if(!user_id) throw new BadRequestError("User not logged in");

            const post = await PostModel.findById(post_id);
            if(!post) return res.status(401).json({ message: 'Post is unavailable' });


            if(post.user_id != user_id) throw new BadRequestError("You are not allowed to edit this post");
            const { title, type_post_id, content, address, website } = req.body;
            console.log("body: " + JSON.stringify(req.body));

            const editFields = {
                title, type_post_id, content, address, website
            };
            for (const [key, value] of Object.entries(editFields)) {
                if (value) {
                    post[key] = value;
                }
            }
            const gridBucket = getGridBucket();
            const { image, video } = req.files;

            if (image || video){
                if(video){
                    if (post.video) {
                        for (const videoId of post.video) {
                            const videoFile = await gridBucket.find({ _id: videoId }).toArray();
                            if (videoFile.length > 0) {
                                await gridBucket.delete(videoFile[0]._id);
                            }
                        }
                    }
                    const videoNew = JSON.parse(JSON.stringify(video[0].id));
                    // console.log(videoNew);
                    post.video = videoNew;

                }
            }
            
            
            await post.save();
            return getInfoData(post, ["_id", "title", "type_post_id", "content", "user_id", "website","address", "image", "video"]);

        }catch(error){
              console.error(error);
              return res.status(500).json({ message: 'Internal Server Error' });
       }
    }

    
    
    static async displayFile(req, res) {
        try {
            const fileId = new mongoose.Types.ObjectId(req.params.fileId);
            const gridBucket = getGridBucket();

            const fileStream = gridBucket.openDownloadStream(fileId);

            fileStream.on('file', (file) => {
                res.set('content-type', file.contentType);
                res.set('content-disposition', `inline; filename="${file.filename}"`);
            });

            fileStream.on('error', (error) => {
                console.error(error);
                res.status(404).json({ error: 'Image not found' });
            });

            fileStream.pipe(res);
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    static async displayFileFromAPost(req, res) {
        try {
            const postId = new mongoose.Types.ObjectId(req.params.postId);
            const post = await PostModel.findById(postId).select('image video');
    
            if (!post) {
                throw new NotFoundError("No post found");
            }
    
            const fileIds = [...post.image, ...post.video];
            console.log(fileIds);
            const gridBucket = getGridBucket();
    
            let contentType = 'image/jpeg';
    
            for (const id of fileIds) {
                const fileStream = gridBucket.openDownloadStream(new mongoose.Types.ObjectId(id));
    
                // Đặt header nếu chưa được đặt
                if (contentType) {
                    res.set('Content-Type', contentType);
                    contentType = null;
                }
                
                res.set('content-disposition', `inline; filename="${id}.jpg"`);
    
                fileStream.on('error', (error) => {
                    console.error(error);
                    return res.status(404).json({ error: 'File not found' });
                });
    
                fileStream.pipe(res);
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    
    static async getAllPostByType(req,res){
        try {
            const type_post_id = new mongoose.Types.ObjectId(req.params.type_post_id);

            let { limit, skip } = req.query;

            limit = parseInt(limit) || 5;
            skip = parseInt(skip) || 0;
    
            const posts = await PostModel
                .find({ type_post_id, status: 'approved'  })
                .limit(limit)
                .skip(skip)
                .populate('user_id', 'username avatar')
                
                .populate('type_post_id', 'name');
                const formattedPosts = await Promise.all(posts.map(async (post) => {
                    const { _id, user_id, title, advertisement_id, type_post_id, content, address, website, image, video, createdAt, updatedAt } = post;
                        
                    const likeCount = await ReactModel.countDocuments({ post_id: _id, react_type: 'like' });
                    const dislikeCount = await ReactModel.countDocuments({ post_id: _id, react_type: 'dislike' });
      
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
                        createdAt,
                        updatedAt,
                        likeCount,
                        avatar: post.user_id.avatar,
                        username: post.user_id.username,
                        user_id: post.user_id._id,
                        dislikeCount
                    };
                    
     
                }));
        
                return formattedPosts;
        } catch(error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async getAllPostByUser(req,res){
        try{
            const user_id = new mongoose.Types.ObjectId(req.params.userId);
            let { limit, skip } = req.query;

            limit = parseInt(limit) || 5;
            skip = parseInt(skip) || 0;
            
            const posts = await PostModel
                .find({ user_id , status: 'approved' })
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
    static async getAllPost(req, res) {
        try {
            let { limit, skip } = req.query;

            limit = parseInt(limit) || 5;
            skip = parseInt(skip) || 0;
    
            const posts = await PostModel
                .find({ status: 'approved' })
                .limit(limit)
                .skip(skip)
                .populate('user_id', 'username avatar')
                .populate('type_post_id', 'name');
    
            const formattedPosts = await Promise.all(posts.map(async (post) => {
                const { _id, user_id, title, advertisement_id, type_post_id, content, address, website, image, video, createdAt, updatedAt } = post;
                    
                const likeCount = await ReactModel.countDocuments({ post_id: _id, react_type: 'like' });
                const dislikeCount = await ReactModel.countDocuments({ post_id: _id, react_type: 'dislike' });
  
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
                    createdAt,
                    updatedAt,
                    likeCount,
                    avatar: post.user_id.avatar,
                    username: post.user_id.username,
                    user_id: post.user_id._id,
                    dislikeCount
                };
                
 
            }));
    
            return formattedPosts;
        } catch(error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    
    

    // static async getInfoUserfromPost(req, res){
    //     try{
    //         const posts = await PostModel.find();
    //         return posts.map(post => getInfoData(post,['_id','user_id']));
    //     }catch(error){
    //         console.error(error);
    //         return res.status(500).json({ message: 'Internal Server Error' });
    //     }
    // }
    
}
module.exports = postService;