const express = require("express");
const postRouter = express.Router();
const { PostModel } = require("../Models/postModel");
const { auth } = require("../Middleware/Auth");
postRouter.use(auth);
postRouter.get("/", async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.status(200).send({ msg: "All Posts", data: posts });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});
postRouter.post("/add", async (req, res) => {
  try {
    let userId = req.userId;
    let name = req.name;
    const post = new PostModel({ ...req.body, userId, name });
    await post.save();
    res.status(200).send({ msg: "Post added successfully" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

postRouter.patch("/update/:post_id", async (req, res) => {
  try {
    const { post_id } = req.params;
    const userId = req.userId;
    const post = await PostModel.findOne({ _id: post_id });
    if (post.userId === userId) {
      await PostModel.findByIdAndUpdate({ _id: post_id }, req.body);
      res.status(200).send({ msg: "Post updated successfully" });
    } else {
      res
        .status(200)
        .send({ msg: `You are not authorized to update this post` });
    }
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});
postRouter.delete("/delete/:post_id", async (req, res) => {
  try {
    const { post_id } = req.params;
    const userId = req.userId;
    const post = await PostModel.findOne({ _id: post_id });
    if (post.userId === userId) {
      await PostModel.findByIdAndDelete({ _id: post_id });
      res.status(200).send({ msg: "Post deleted successfully" });
    } else {
      res
        .status(200)
        .send({ msg: `You are not authorized to delete this post` });
    }
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

module.exports = { postRouter };
