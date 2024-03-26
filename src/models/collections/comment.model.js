const {model, Schema} = require('mongoose');
const COLLECTION_NAME = 'comment';

const commentSchema = new Schema(
    {
        post_id:{
            type: Schema.Types.ObjectId,
            ref: 'post',
            required: [true,"Please provide a post"],
        },
        creator_id:{
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: [true,"Please provide a creator"],
        },
        content:{
            type: String,
            required: [true,"Please provide content"],
        },
        status:{
            type: String,
            enum: ['trending','normal','hide'],
            default: 'normal',
        }
    },
    {
        timestamps: true,
    },


);

// export
module.exports = model(COLLECTION_NAME,commentSchema);