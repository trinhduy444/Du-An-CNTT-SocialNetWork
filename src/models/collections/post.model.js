const {model, Schema} = require('mongoose');
const COLLECTION_NAME = 'post';
const mongoose = require('mongoose');

const postModel = new Schema(
    {
        title: {
            type: String,
            required: [true,"Please provide a title"],

        },
        advertisement_id:{
            type: String,
        },
        type_post_id:{

            type: mongoose.Types.ObjectId,
            ref: 'postType',
            required: [true,"Please provide a type post"],
        },
        user_id:{
            type: mongoose.Types.ObjectId,
            ref: 'user',
            required: [true,"Please provide a user"],
        },
        content:{
            type: String,
            required: [true,"Please provide content"],
        },
        address:{
            type: String,
        },
        website:{
            type: String,
        },
        image: {
            type: [Schema.Types.ObjectId],
            default: [],
        }, 

        video: {
            type: [Schema.Types.ObjectId],
            default: [],
        },
        status:{
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        }
        

    },
    {
        timestamps: true,
    },


);

// export
module.exports = model(COLLECTION_NAME,postModel);