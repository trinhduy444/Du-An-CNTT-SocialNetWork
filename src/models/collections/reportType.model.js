const {model, Schema} = require('mongoose');
const COLLECTION_NAME = 'reportType';

const reportTypeModel = new Schema(
    {
        name: {
            type: String,
            required: [true,"Please provide a name"],
            unique: true,
            undefined: false,
        },
        report_from:{
            type: String,
            enum: ['post', 'personal page','commnent','other'],
            
        },
        admin_id_created:{
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        }
    },
    {
        timestamps: true,
    },


);

// export
module.exports = model(COLLECTION_NAME,reportTypeModel);