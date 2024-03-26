const { KeyTokenModel} = require('../index');
const {NotFoundError} = require('../../utils/response/error.response');
const findUserIdByRefeshtokenUsing = async (refeshTokenUsing) => { 
    const keyStore = await KeyTokenModel.findOne({ refreshTokenUsing: refeshTokenUsing });
    if(!keyStore) throw new NotFoundError("Could not find the user from the token")
    // console.log(keyToken);
    const userId = keyStore.userId;
    return userId;
};

module.exports = {findUserIdByRefeshtokenUsing}