const {model, Schema} = require('mongoose');
const COLLECTION_NAME = 'react';

const reactSchema = new Schema(
    {   react_type:{
            type: String,
            enum: ['like', 'dislike'],
            required: [true,"Please provide a type"],
        },
        from:{
            type: String,
            enum: ['post', 'comment'],
            required: [true,"Please provide a type"],
        },
        creator_id:{
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: [true,"Please provide a creator"],
        },
        post_id:{
            type: Schema.Types.ObjectId,
            ref: 'post',
        },
        comment_id:{
            type: Schema.Types.ObjectId,
            ref: 'comment',
        }
    },
    {
        timestamps: true,
    },


);

// export
module.exports = model(COLLECTION_NAME,reactSchema);