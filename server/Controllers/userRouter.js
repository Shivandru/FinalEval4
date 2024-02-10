const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { UserModel } = require("../Models/userModel");
const { BlacklistModel } = require("../Models/blacklistModel");
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(404).send({ msg: "User already exists" });
    } else {
      bcrypt.hash(password, 5, async function (err, hash) {
        if (err) {
          res.status(404).send(`Something went wrong ${err}`);
        } else {
          const user = new UserModel({ ...req.body, password: hash });
          await user.save();
          res.status(200).send({ msg: "User created successfully" });
        }
      });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          let accessToken = jwt.sign(
            { name: user.name, userId: user._id },
            accessTokenKey,
            {
              expiresIn: "1h",
            }
          );
          let refreshToken = jwt.sign(
            { name: user.name, userId: user._id },
            refreshTokenKey,
            {
              expiresIn: "1d",
            }
          );
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
          });
          res.status(200).send({ msg: `User Logged in successfully` });
        } else {
          res.status(400).send({ msg: "Invalid Credentials" });
        }
      });
    } else {
      res.status(400).send({ msg: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

userRouter.get("/logout", async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.cookies;
    const blacklistAccessToken = new BlacklistModel({
      token: accessToken,
    });
    const blacklistRefreshToken = new BlacklistModel({
      token: refreshToken,
    });
    await blacklistAccessToken.save();
    await blacklistRefreshToken.save();
    res.status(200).send({ msg: "User logged out successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = { userRouter };
