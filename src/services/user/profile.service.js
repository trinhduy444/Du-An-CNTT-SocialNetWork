const {BadRequestError, NotFoundError} = require('../../utils/response/error.response');
const { UserModel, PostModel,ReactModel,FollowModel } = require('../../models/index');
const {findUserIdByRefeshtokenUsing} = require('../../models/repositories/keyToken.repository');
const { getInfoData } = require('../../utils/index');
require('dotenv').config({path: __dirname + '/../../.env'}); // dotenv
const { getGridBucket } = require('../../middleware/multer.middleware');
const {checkImage} = require('../../utils/file/fileUpload.util');
class profileService{
  static async getProfile(req, res) {
    try {
      const userID = req.user.userId;
      const user = await UserModel.findOne({_id: userID});
      if (!user) throw new NotFoundError('User not found');

      return getInfoData(user, ["_id", "permissions" ,"username", "email", "avatar","surname","phone_number","birthday","status"]);  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userID = req.user.userId;
      const user = await UserModel.findOne({_id: userID});
      if (!user) throw new NotFoundError('User not found');

      const {username, surname, phone_number, birthday, status} = req.body;
      const updateFields = {
        username,
        surname,
        phone_number,
        birthday,
        status,
      };
      
      for (const [key, value] of Object.entries(updateFields)) {
        if (value) {
          user[key] = value;
        }
      }

      await user.save();
      return getInfoData(user, ["_id", "permissions" ,"username", "email", "avatar","surname","phone_number" ,"birthday","status"]);  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }


    
  static async updateAvatar(req,res,next){
    try {
      const userId = req.user.userId; 
      const user = await UserModel.findOne({ _id: userId });
      if (!user) throw new NotFoundError("User not found");
      const file = req.file;
      if (!file) throw new NotFoundError("File not found");

      
      const gridBucket = getGridBucket();
      if (user.avatar) {
        const avatarFile = await gridBucket.find({ filename: user.avatar }).toArray();
        if (avatarFile.length > 0) {
          await gridBucket.delete(avatarFile[0]._id);
        }
      }
      
      user.avatar = file.filename; 
      await user.save();
    
      return getInfoData(user, ["_id","username","avatar"]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  static async getAvatar(req, res) {
    const userId = req.user.userId;
    const user = await UserModel.findOne({ _id: userId }).select('avatar');

    const gridBucket = getGridBucket();
    if (!gridBucket) {
      return res.status(500).json({ error: 'GridFSBucket is not available' });
    }

    const filename = user.avatar;
    try {
      const fileStream = gridBucket.openDownloadStreamByName(filename);
      
      fileStream.on('file', (file) => {
        res.set('content-type', file.contentType);
        res.set('content-disposition', `inline; filename="${file.filename}"`);
      });

      fileStream.on('error', (error) => {
        console.error(error);
        return res.status(404).json({ error: 'File not found' });
      });

      fileStream.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

    static async getAvatarByName(req, res) {
      const filename = req.params.filename;
      if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
      }
      const gridBucket = getGridBucket();
      if (!gridBucket) {
        return res.status(500).json({ error: 'GridFSBucket is not available' });
      }
      try {
        const fileStream = gridBucket.openDownloadStreamByName(filename);
        
        fileStream.on('file', (file) => {
          res.set('content-type', file.contentType);
          res.set('content-disposition', `inline; filename="${file.filename}"`);
        });

        fileStream.on('error', (error) => {
          console.error(error);
          return res.status(404).json({ error: 'File not found' });
        });

        fileStream.pipe(res);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
    static async viewProfileByID(req, res) {
      try {
          const userId = req.params.userid;
  
          const user = await UserModel.findOne({ _id: userId });
          if (!user) throw new NotFoundError('User not found');
  
          const limit = parseInt(req.query.limit) || 5;
          const skip = parseInt(req.query.skip) || 0;
  
          const posts = await PostModel.find({ user_id: userId, status: 'approved' }).sort({ createdAt: -1 }).limit(limit).skip(skip);
  
          const postsWithReactData = await Promise.all(posts.map(async (post) => {
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
                  dislikeCount
              };
          }));
          
          const followerCount = await FollowModel.countDocuments({ followed_id: userId });
          const followingCount = await FollowModel.countDocuments({ follower_id: userId });
          return {
              user: {
                  _id: user._id,
                  username: user.username,
                  email: user.email,
                  createdAt: user.createdAt,
                  avatar: user.avatar,
                  followerCount,
                  followingCount
              },
              posts: postsWithReactData
          };
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  
  
  

}

module.exports = profileService;