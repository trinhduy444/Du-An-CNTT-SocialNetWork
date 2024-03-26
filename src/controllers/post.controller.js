const { OK,CREATED } = require('../utils/response/success.response');

const postManagementService = require('../services/admin/postManagement.service');
const postService = require('../services/user/post.servcice');
const {PostModel} = require('../models/index');

//user
const getAllPostTypes = async (req, res) =>{
    new OK({
        message: 'Get All Post Types Successfully',
        metadata: await postService.getAllPostType(req, res),
    }).send(res);
}
const createPost = async (req, res) =>{
    new CREATED({
        message: 'Create Post Successfully',
        metadata: await postService.createPost(req, res),
    }).send(res);
}
const editPost = async (req, res) =>{
    new OK({
        message: 'Update Post Successfully',
        metadata: await postService.editPost(req, res),
    }).send(res);
}

const openDetail = async (req, res) =>{
    new OK({
        message: 'Update Post Successfully',
        metadata: await postService.openDetail(req, res),
    }).send(res);
}
const deletePost = async (req, res) =>{
    new OK({
        message: 'Delete Post Successfully',
        metadata: await postService.deletePost(req, res),
    }).send(res);
}

const displayFile = async (req, res) =>{
    await postService.displayFile(req, res);
}
const getPost = async (req, res) =>{
    new OK({
        message: 'Get Post Successfully',
        metadata: await postService.getPost(req, res),
    }).send(res);
}
const displayFileFromAPost = async (req, res) =>{
    await postService.displayFileFromAPost(req, res);
}
const getAllPostByType = async (req, res) =>{
    new OK({
        message: 'Get Post Successfully',
        metadata: await postService.getAllPostByType(req, res),
    }).send(res);
}
const getAllPostByUser = async (req, res) =>{
    new OK({
        message: 'Get Post Successfully',
        metadata: await postService.getAllPostByUser(req, res),
    }).send(res);
}
const getAllPost= async (req, res) =>{
    new OK({
        message: 'Get Post Successfully',
        metadata: await postService.getAllPost(req, res),
    }).send(res);
}
module.exports = { getAllPostTypes,createPost,editPost,openDetail,deletePost,displayFile,getPost,displayFileFromAPost,getAllPostByType,getAllPostByUser,getAllPost}