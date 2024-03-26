const {model, Schema} = require('mongoose');
const COLLECTION_NAME = 'follow';

const followSchema = new Schema(
    {
        follower_id:{
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: [true,"Please provide a follower"],
        },
        followed_id:{
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: [true,"Please provide a followed"],
        },
        status:{
            type: String,
            enum: ['active', 'inactive', 'blocked', 'pending'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    },


);

// export
module.exports = model(COLLECTION_NAME,followSchema);