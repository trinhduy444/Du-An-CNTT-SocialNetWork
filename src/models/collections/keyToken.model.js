const mongoose = require('mongoose');
const COLLECTION_NAME = 'Token';

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    publicKey:{
        type: String,
        required: true,
    },
    privateKey:{
        type: String, 
        required: true
    },
    refreshTokenUsing: {
        type: String,
        required: true,
      },
      refreshTokenUsed: {
        type: [String],
        default: [],
      },
    },
        { timestamps: true }
);
module.exports = mongoose.model(COLLECTION_NAME, tokenSchema);