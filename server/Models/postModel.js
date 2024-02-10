const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    body: { type: String },
    device: { type: String, enum: ["pc", "mobile", "tablet"], default: "pc" },
    userId: { type: String },
    name: { type: String },
  },
  {
    versionKey: false,
  }
);

const PostModel = mongoose.model("post", postSchema);

module.exports = { PostModel };
