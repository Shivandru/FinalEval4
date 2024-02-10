const express = require("express");
require("dotenv").config();
const { connection } = require("./Configs/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { userRouter } = require("./Controllers/userRouter");
const { postRouter } = require("./Controllers/postRouter");
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
    httpOnly: true,
  })
);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.get("/", (req, res) => {
  res.send("Home Page");
});
app.listen(port, async () => {
  try {
    await connection;
    console.log(`listening on port ${port} MongoAtlas Connected...`);
  } catch (error) {
    console.log(error);
  }
});
