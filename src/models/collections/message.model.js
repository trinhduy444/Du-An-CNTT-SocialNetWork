const {model, Schema} = require('mongoose');
const COLLECTION_NAME = 'message';
const mongoose = require('mongoose');

const messageModel = new Schema(
    {
        sender_id:{
            type: mongoose.Types.ObjectId,
            ref: 'user',
            required: [true,"Please provide a sender"],
        },
        receiver_id:{
            type: mongoose.Types.ObjectId,
            ref: 'user',
            required: [true,"Please provide a receiver"],
        },
        content:{
            type: String,
            required: [true,"Please provide content"],
        },
        status:{
            type: String,
            enum: ['not viewed','viewed'],
            default: 'not viewed',
        },

    },
    {
        timestamps: true,
    },


);

// export
module.exports = model(COLLECTION_NAME,messageModel);