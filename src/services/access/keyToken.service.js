const { NotFoundError } = require("../../utils/response/error.response");
const { KeyTokenModel } = require("../../models/index");

class KeyTokenService {
  static async createKeyToken({ userId, privateKey, publicKey, refreshTokenUsing = null }) {
    const filter = { userId };
    const dateUpdate = {
      privateKey,
      publicKey,
      refreshTokenUsing,
      refreshTokenUsed: [],
    };
    const options = {
      new: true,
      upsert: true,
    };
    const tokens = await KeyTokenModel.findOneAndUpdate(filter, dateUpdate, options);
    return tokens ? tokens.publicKey : null;
  }

  static async findTokenByUserId(userId) {
    const token = await KeyTokenModel.findById(userId);
    if (!token) throw new NotFoundError("Token dost not exist");
    return token;
  }

  static async findUserIdByRefeshtokenUsing(refreshToken) {
    const user = await KeyTokenModel.findOne({refreshTokenUsing: refreshToken});
    if (!refreshToken) throw new NotFoundError("Token doen't exist");
    return user.userId;
  }
  static async deleteTokenById(id) {
    const tokenDeleted = await KeyTokenModel.findOneAndDelete({ _id: id });
    if (!tokenDeleted) throw new NotFoundError("Token doesn't exist");
    return tokenDeleted;
  }
  static async deleteTokenByUserId(userId) {
    const tokenDeleted = await KeyTokenModel.findOneAndDelete({ userId });
    if (!tokenDeleted) throw new NotFoundError("Token doesn't exist");
    return tokenDeleted;
  }
  static async deleteTokenByRefreshToken(refreshToken) {
    const tokenDeleted = await KeyTokenModel.findOneAndDelete({ refreshTokenUsing: refreshToken });
    if (!tokenDeleted) throw new NotFoundError("Token doesn't exist");
    return tokenDeleted;
  }
  static async findRefreshTokenUsed(refreshToken) {
    const token = await KeyTokenModel.findOne({ refreshTokenUsed: refreshToken });
    if (!token) throw new NotFoundError("Token doesn't exist");
    return token;
  }
  static async findRefreshTokenUsing(refreshToken) {
    const token = await KeyTokenModel.findOne({ refreshTokenUsing: refreshToken });
    if (!token) throw new NotFoundError("Token doesn't exist");
    return token;
  }
}

module.exports = KeyTokenService;