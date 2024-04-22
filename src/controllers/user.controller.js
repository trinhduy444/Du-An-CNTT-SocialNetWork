const { OK,CREATED } = require('../utils/response/success.response');
const profileService = require('../services/user/profile.service');

const getProfile = async (req, res) =>{
  new OK({
      message: 'Get Profile Successfully',
      metadata: await profileService.getProfile(req, res),
  }).send(res);
}

const updateProfile = async (req, res) =>{
  new OK({
      message: 'Update Profile Successfully',
      metadata: await profileService.updateProfile(req, res),
  }).send(res);
}

const updateAvatar = async (req, res,next) =>{
  new OK({
      message: 'Update Avatar Successfully',
      metadata: await profileService.updateAvatar(req, res,next),
  }).send(res);
}
const getAvatar = async (req, res,next) => {
  await profileService.getAvatar(req, res,next);
};  
const getAvatarByName = async (req, res) => {
  await profileService.getAvatarByName(req, res);
};

const viewProfileByID = async (req, res) =>{
  new OK({
      message: 'Get Profile Successfully',
      metadata: await profileService.viewProfileByID(req, res),
  }).send(res);
}
const viewFollowers = async (req, res) =>{
  new OK({
      message: 'Get Profile Successfully',
      metadata: await profileService.viewFollowers(req, res),
  }).send(res);

}
const viewFolloweds = async (req, res) =>{
  new OK({
      message: 'Get Profile Successfully',
      metadata: await profileService.viewFolloweds(req, res),
  }).send(res);
}
module.exports = {getProfile , updateProfile, updateAvatar,getAvatar,getAvatarByName,viewProfileByID,viewFolloweds,viewFollowers}

