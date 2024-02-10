const jwt = require("jsonwebtoken");
require("dotenv").config();
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
const { BlacklistModel } = require("../Models/blacklistModel");

async function auth(req, res, next) {
  const { accessToken, refreshToken } = req.cookies;
  console.log(accessToken, refreshToken);
  try {
    const blacklist = await BlacklistModel.findOne({ token: accessToken });
    if (blacklist) {
      return res.status(400).send({ msg: `Please Login Again` });
    } else {
      jwt.verify(accessToken, accessTokenKey, function (err, decoded) {
        if (decoded) {
          req.name = decoded.name;
          req.userId = decoded.userId;
          next();
        } else {
          jwt.verify(refreshToken, refreshTokenKey, function (err, decoded) {
            if (decoded) {
              var newToken = jwt.sign(
                { name: decoded.name, userId: decoded.userId },
                accessTokenKey,
                {
                  expiresIn: "1h",
                }
              );
              res.cookie("accessToken", newToken, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
              });
              req.name = decoded.name;
              req.userId = decoded.userId;
              console.log(newToken);
              next();
            } else {
              res.status(400).send({ msg: `Please Login Again...` });
            }
          });
        }
      });
    }
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
}

module.exports = { auth };
