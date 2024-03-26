const { OK,CREATED } = require('../utils/response/success.response');
const reactService = require('../services/user/react.service');

const createComment= async (req, res) =>{
    new CREATED({
        message: 'Comment Created Successfully',
        metadata: await reactService.createComment(req, res),
    }).send(res);
}
const createLikeAPost = async (req, res) =>{
    new OK({
        message: 'Like Post Successfully',
        metadata: await reactService.createLikeAPost(req, res),
    }).send(res);
}
const createDisLikeAPost = async (req, res) =>{
    new OK({
        message: 'DisLike Post Successfully',
        metadata: await reactService.createDislikeAPost(req, res),
    }).send(res);
}
const createLikeAComment = async (req, res) =>{
    new OK({
        message: 'Like Comment Successfully',
        metadata: await reactService.createLikeAComment(req, res),
    }).send(res);
}
const createDisLikeAComment = async (req, res) =>{
    new OK({
        message: 'DisLike Comment Successfully',
        metadata: await reactService.createDislikeAComment(req, res),
    }).send(res);
}
const deleteComment = async (req, res) =>{
    new OK({
        message: 'Comment Deleted Successfully',
        metadata: await reactService.deleteComment(req, res),
    }).send(res);
}
const updateComment = async (req, res) =>{
    new OK({
        message: 'Comment Updated Successfully',
        metadata: await reactService.updateComment(req, res),
    }).send(res);
}

const getAllCommentFromAPost = async (req, res) =>{
    new OK({
        message: 'Get All Comment From A Post Successfully',
        metadata: await reactService.getAllCommentFromAPost(req, res),
    }).send(res);
}

module.exports= {createLikeAPost,createComment,createDisLikeAPost,createLikeAComment,createDisLikeAComment,deleteComment,updateComment,getAllCommentFromAPost}