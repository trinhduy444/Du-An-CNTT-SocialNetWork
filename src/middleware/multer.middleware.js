require('dotenv').config({path: __dirname + '/../.env'}); // dotenv
const path = require('path');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const mongoose = require('mongoose');


const url = process.env.URL_DATABASE;
const conn = mongoose.createConnection(url);
let gridBucket; 
conn.once('open', () => {
  gridBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
  // console.log(gridBucket);
});

const storage = new GridFsStorage({
  url: url,
  file: (req, file) => {
    let filename;
    const userid = req.user.userId;
    if (req.url.includes('updateAvatar') == true) {
      filename = 'avatar-' + userid + '-' + Date.now() + path.extname(file.originalname);
    } else if (req.url.includes('createPost')) {
      filename = 'post-' + userid + '-' + Date.now() + path.extname(file.originalname);
    } else {
      filename = 'defaut-' + userid + '-' + Date.now() + path.extname(file.originalname);
    }
    return {
      filename: filename,
      bucketName: 'uploads',
    };
  },
});


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // (10 MB)
    files: 5,
  },
});
module.exports = {upload, getGridBucket: () => gridBucket };
