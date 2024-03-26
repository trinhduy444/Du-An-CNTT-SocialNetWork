const { OK } = require('../utils/response/success.response');
const authSerivce = require('../services/access/auth.service');


const signUp = async (req, res) => {
    new OK({
        message: "Sign Up Account successfully",
        metadata: await authSerivce.signUp(req, res),
    }).send(res);

}
const logIn = async (req, res) => {
    new OK({
        message: "Log In Account successfully",
        metadata: await authSerivce.logIn(req, res),
    }).send(res);
}
const logOut = async (req, res) => {
    new OK({
        message: "Log Out Account successfully",
        metadata: await authSerivce.logOut(req, res),
    }).send(res);
}
const refreshAccessToken = async (req, res) => {
    new OK({
        message: "Refresh Access Token successfully",
        metadata: await authSerivce.refreshAccessToken(req, res),
    }).send(res);
}
const resetPassword = async (req, res,next) => {
    new OK({
        message: "Reset Password successfully",
        metadata: await authSerivce.resetPassword(req),
    }).send(res);
}

const forgotPassword = async (req, res) => {
    new OK({
        message: "Forgot Password successfully",
        metadata: await authSerivce.forgotPassword(req, res),
    }).send(res);
}
const changePassword = async (req, res) => {
    new OK({
        message: "Change Password successfully",
        metadata: await authSerivce.changePassword(req, res),
    }).send(res);
}
module.exports = {signUp, logIn, logOut, refreshAccessToken, resetPassword, forgotPassword, changePassword};

