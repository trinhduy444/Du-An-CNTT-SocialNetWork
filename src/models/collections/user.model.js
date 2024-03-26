const bcrypt = require('bcrypt');
const {model, Schema} = require('mongoose');
const COLLECTION_NAME = 'user';
const crypto = require('crypto');

const userSchema = new Schema(
    {
        permission:{
            type: String,
            enum: ['user','admin'],
            default: 'user',
        },
        password:{
            type: String,
            required: [true,"Please provide a password"],
        },

        avatar:{
            type: String,
        },

        username:{
            type: String,
            required: [true,"Please provide a username"],
        },
        
        surname:{
            type: String,
        },

        email:{
            type: String,
            required: [true,"Please provide a email"],
            unique: true,
        },

        phone_number:{
            type: String,
            required: [true,"Please provide a phone number"],
            unique: true,       
        },

        birthday:{
            type: Date,
        },

        status:{
            type: String,
            enum: ['active', 'inactive', 'blocked', 'pending'],
            default: 'inactive',
        },
        resetPasswordToken: {
            type: String,
        
        },
        resetPasswordExpires: {
            type: Date,
        },
        validateBeforeSave:{
            type: Boolean,
            default: true,
        },
        passwordChangedAt:{
            type: Date,
        },
        
    },
    {
        timestamps: true,
    },


);

// Function to create a reset password token and set the expiration time
userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    const expiresIn = new Date();
    expiresIn.setHours(expiresIn.getHours() + 1); // 1 hour
  
    this.resetPasswordToken = resetToken;
    this.resetPasswordExpires = expiresIn;
  
    return resetToken;
  };

// export
module.exports = model(COLLECTION_NAME,userSchema);