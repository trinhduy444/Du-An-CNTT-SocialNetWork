const {model, Schema} = require('mongoose');
const COLLECTION_NAME = 'postType';
const mongoose = require('mongoose');

const postTypeModel = new Schema(
    {
        name: {
            type: String,
            enum: ['Fashion','Food and Drinks','Services','Others'],
            unique: true,
        },
        admin_id_created:{
            type: mongoose.Types.ObjectId,
            ref: 'user',
            required: [true,"Don't have admin access"],
        }
    },
    {
        timestamps: true,
    },


);

// export
module.exports = model(COLLECTION_NAME,postTypeModel);