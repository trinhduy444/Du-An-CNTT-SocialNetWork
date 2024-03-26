const JWT = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { KeyTokenModel } = require("../models/index");
const { ForbiddenError, UnauthenticatedError, BadRequestError } = require("../utils/response/error.response");


const HEADERS = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-key",
  PERMISSION_KEY: "x-permissions-key",
  REFRESH_TOKEN: "x-rtoken-id",
};

const createTokenPair = async (payload, privateKey, publicKey) => {
  const accessToken = JWT.sign(payload, publicKey, { expiresIn: "1d" });
  const refreshToken = JWT.sign(payload, privateKey, { expiresIn: "7d" });

  JWT.verify(accessToken, publicKey, (err, decode) => {
    if (err) console.log(`Error verify::: ${err}`);
    else console.log(`Decode verify::: ${JSON.stringify(decode)}`);
  });

  return { accessToken, refreshToken };
};


const authentication = async (req, res, next) => {

  const accessToken = req.headers.authorization;
  console.log(">>>>>>>>>>>>>>>>>> access token:",accessToken);
  if (!accessToken?.startsWith("Bearer ")) throw new ForbiddenError("Token invalid"); // 403

  let refreshToken = req.headers['x-rtoken-id']; // Lấy refreshToken từ header
  if(!refreshToken){
    refreshToken  = req.cookies.refreshToken;
    if (!refreshToken) throw new BadRequestError("refreshToken doesn't exist on cookies"); // 400
  }
  // console.log(">>>>>>>>>>>>>>>>> refresh token:",refreshToken);
  

  const keyStore = await KeyTokenModel.findOne({ refreshTokenUsing:  refreshToken });
  if (!keyStore) throw new ForbiddenError("KeyStore invalid"); // 403

  const payload = JWT.verify(accessToken.split(" ")[1], keyStore.publicKey);
  // console.log("payload", payload);
  req.user = payload;
  return next();
};

const checkAuthIsUser = async (req, res, next) => {
  await authentication(req, res, next);
  const {permission} = req.user;
  if(permission !== "user") throw new UnauthenticatedError("You can't access here, don't have permission"); // 401

};

const checkAuthIsAdmin = async (req, res, next) => {
  await authentication(req, res, next);
  // console.log(req.user)
  const {permission} = req.user;
  if(permission !== "admin") throw new UnauthenticatedError("You can't access here, don't have permission"); // 401

};
module.exports = {  createTokenPair,
  authentication,
  checkAuthIsUser,
  checkAuthIsAdmin };
