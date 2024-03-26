require('dotenv').config({path: __dirname + '/../.env'}); // dotenv

const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UserModel } = require('../../models/index');
const { createTokenPair } = require("../../middleware/auth.middleware");
const { InvalidInputError, NotFoundError ,BadRequestError, ForbiddenError}= require('../../utils/response/error.response');
const { getInfoData } = require('../../utils/index');
const createKeys = require("../../utils/key/createKey.util");
const KeyTokenService  = require('./keyToken.service');
const sendMail = require('../../utils/email.util');
const BASE_URL = process.env.BASE_URL;
class authService {
    /*
    1. signup User with data: username, password, email (unique), password
    2. Check user exists
    3. hash password
    4. create User 
    */
    static async signUp(req, res) {
        try{
            const{username, phone_number, email ,password} = req.body;

            let userExist = false;
            if(req.body.email !== ''){
                await UserModel.findOne ({email: req.body.email}).then(UserModel=>{
                    if(UserModel){
                        userExist = true;
                    }
                })
                .catch(error => console.log(error));
            }
            if (userExist) {
                throw new InvalidInputError('Email đã tồn tại, không thể đăng ký');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
    
            const newUser = new UserModel({username, phone_number, email, password: hashedPassword});
            await newUser.save();
        } catch(error){
            console.error(error);
            if (error instanceof InvalidInputError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Lỗi server' });
            }
        }
    }

    /*
    1. Login with data: email, password
    2. Find user with email
    3. Check matching password input and password in database 
    4. create public key and private key for bcrypt
    5. create AToken and RToken for the user
    6. Save Token in database
    7. Save RToken in cookie
    */
    static async logIn(req, res) {
        try{

            const {email, password} = req.body;
            const user = await UserModel.findOne({email: email});
            if (!user) {
                throw new InvalidInputError('Email không tồn tại');
            }

            const isMatchingPassword = await bcrypt.compare(password, user.password);
            if(!isMatchingPassword) {
                throw new InvalidInputError('Sai mật khẩu');
            }
            // tao khoa
            const { privateKey, publicKey } = createKeys();

            // Tạo và lưu AccessToken và RefreshToken
            const { accessToken, refreshToken } = await createTokenPair(
                { userId: user._id, username: user.username ,email: user.email, permission: user.permission, phone_number: user.phone_number},
                privateKey,
                publicKey
            );
            // console.log("refeshhhhhhhhhh: "+refreshToken);
            // Lưu RefreshToken vào cơ sở dữ liệu
            const keyStore = await KeyTokenService.createKeyToken({
                userId: user._id,
                privateKey,
                publicKey,
                refreshTokenUsing: refreshToken,
            });

            if (!keyStore) {
                throw new BadRequestError('Key Store Error');
            }
            // save refreshToken in 7 day
            res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
            
            return {
                user: getInfoData(user, ["_id", "username", "email", "phone_number","permission"]),
                accessToken,refreshToken
            };           
        } catch(error){
            console.error(error);
            if (error instanceof InvalidInputError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Lỗi server' });
            }
        }
    }

    /*
    1. clear RT in cookies
    2. clear token in database
    */
    static async logOut(req, res) {
        try{
            let refreshToken = req.headers['x-rtoken-id']; // Lấy refreshToken từ header
            if(!refreshToken){
              refreshToken  = req.cookies.refreshToken;
              if (!refreshToken) throw new BadRequestError("refreshToken không có trong Cookies"); 
            }
            const keyDeleted = await KeyTokenService.deleteTokenByRefreshToken(refreshToken);
            res.clearCookie('refreshToken', { httpOnly: true, secure: true })

            return getInfoData(keyDeleted, ["userId", "refreshTokenUsing"]);
        } catch(error){
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    /*
    1. Get RT in cookies
    2. Check RT in database
    3. Create new AT and RT
    */
    static async refreshAccessToken(req, res) {
        let refreshToken = req.headers['x-rtoken-id']; // Lấy refreshToken từ header
        if(!refreshToken){
          refreshToken  = req.cookies.refreshToken;
          if (!refreshToken) throw new BadRequestError("refreshToken không có trong Cookies"); 
        }
    
        const keyStore = await KeyTokenService.findRefreshTokenUsing(refreshToken);
        if (!keyStore) throw new BadRequestError("KeyStore save refresh token dost not exist");
    
        const { privateKey, publicKey } = keyStore;
    
        const payload = JWT.verify(refreshToken, privateKey);
    
        if (!payload) throw new BadRequestError("Verify Token Error");
    
        const { userId, username, email, permission } = payload;
    
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await createTokenPair(
          { userId, username, email, permission },
          privateKey,
          publicKey
        );
    
        // Update refresh token
        await keyStore.updateOne({
          $set: {
            refreshTokenUsing: newRefreshToken,
          },
          $addToSet: {
            refreshTokenUsed: refreshToken,
          },
        });
    
        // Save refreshToken to cookie( age: 7day)
        res.cookie("refreshToken", newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        return {
          user: { userId, username, email },
          newAccessToken,
          newRefreshToken,
        };
    }
    /*
    1. Get secretToken from params when user click the link reset password
    2. check user exists
    3. get newpassword and repeatenewpassword and check matching
    4. hash newpassword
    5. save newpassword
    */
    static async resetPassword(req,res,next) {
        const secretToken = req.params.secretToken;

        const user = await UserModel.findOne({resetPasswordToken: secretToken, resetPasswordExpires: {$gt: Date.now()}});
        if(!user) {throw new BadRequestError('Token không hợp lệ hoặc đã hết hạn');}
        

        const {newPassword, repeatNewPassword} = req.body;
        if (newPassword.trim() !== repeatNewPassword.trim()) throw new InvalidInputError("NewPassword must be same RepeatNewPassword")

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.passwordChangedAt = Date.now();
        await user.save();
        return
    }

    /*
    1. Get email
    2. Check email exists
    3. Create resetToken
    4. Send email
    */
    static async forgotPassword(req, res) {
        const {email} = req.body;
        const user = await UserModel.findOne({email: email});
        if (!user) {
            throw new NotFoundError('Email không tồn tại');
        }
        const resetToken = user.createResetPasswordToken();
        // console.log("resetToken: " + resetToken);

        await user.save({validateBeforeSave: false});

        const resetURL = `${BASE_URL}/resetPassword/${resetToken}`;
        const message= 'We have received a request to reset the password for your account. If you did not make this request, simply ignore this email. Otherwise, please click the button below to reset your password. \n\n'+ resetURL +' \n\n';

        // send email
        try{
            await sendMail({
            email: user.email,
            subject: 'Password change request on RaT',
            message: message,
        });
        return getInfoData(user, ["_id", "email"]);

        }catch(error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save({validateBeforeSave: false});
            throw new BadRequestError('Email không thể gửi');
        };

    }

    /*
    1. Get currentPassword, newPassword, repeatNewPassword
    2. Check currentPassword is valid and correct
    3. Check newPassword is same repeatNewPassword
    4. hash newPassword
    5. save newPassword
    */
    static async changePassword(req) {
        const { currentPassword, newPassword, repeatNewPassword } = req.body;
        let refreshToken = req.headers['x-rtoken-id']; // Lấy refreshToken từ header
        if(!refreshToken){
          refreshToken  = req.cookies.refreshToken;
          if (!refreshToken) throw new BadRequestError("refreshToken không có trong Cookies"); 
        }
        const userId = await KeyTokenService.findUserIdByRefeshtokenUsing(refreshToken);
        if (!userId) {
            throw new ForbiddenError("User not found");
        }

        const user = await UserModel.findOne({ _id: userId });
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        
        if(!isCurrentPasswordValid){
            throw new InvalidInputError("Mật khẩu hiện tại không đúng");
        }

        if (newPassword.trim() !== repeatNewPassword.trim()) throw new InvalidInputError("NewPassword must be same RepeatNewPassword")

        const hashNewPassword = await bcrypt.hash(newPassword, 10);

        
        user.password = hashNewPassword;
        user.passwordChangedAt= Date.now();
        await user.save();

        return getInfoData(user, ["_id", "username", "email"]);
    }
}


module.exports = authService;