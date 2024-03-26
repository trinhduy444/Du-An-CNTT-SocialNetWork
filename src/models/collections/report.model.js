const {model, Schema} = require('mongoose');
const COLLECTION_NAME = 'report';
const mongoose = require('mongoose');

const reportModel = new Schema(
    {
        report_type_id:{
            type: mongoose.Types.ObjectId,
            ref: 'reportType',
            required: [true,"Please provide a type post"],
        },
        creator_id:{
            type: mongoose.Types.ObjectId,
            ref: 'user',
            required: [true,"Please provide a creator"],
        },
        reported_user_id:{
            type: mongoose.Types.ObjectId,
            ref: 'user',
            required: [true,"Please provide a user reported"],
        },
        administrator_id:{
            type: mongoose.Types.ObjectId,
            ref: 'user',
        },
        post_id:{
            type: mongoose.Types.ObjectId,
            ref: 'post',
        },
        content:{
            type: String,
            required: [true,"Please provide content"],
        },
        status:{
            type: String,
            enum: ['not viewed','viewed','reviewed'],
            default: 'not viewed',
        },
        violation:{
            type: Boolean,
            default: false,
        },
        messages:{
            type: [Schema.Types.ObjectId],
            ref: 'message',
            default: [],
        },
        image: {
            type: [Schema.Types.ObjectId],
            default: [],
        }, 

    },
    {
        timestamps: true,
    },


);

// export
module.exports = model(COLLECTION_NAME,reportModel);