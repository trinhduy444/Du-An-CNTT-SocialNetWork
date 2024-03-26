const checkImage = (file) => {
    if (!file || !file.mimetype.startsWith('image/')) {
      return false;
    }
    return true;
};
module.exports = { checkImage };