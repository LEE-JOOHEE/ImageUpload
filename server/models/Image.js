const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    user: {
      _id: { type: mongoose.Types.ObjectId, required: true, index: true },
      name: { type: String, required: true },
      username: { type: String, required: true },
    },
    public: { type: Boolean, required: true, default: false },
    likes: [{ type: mongoose.Types.ObjectId }],
    key: { type: String, required: true },
    originalFileName: { type: String, required: true },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("image", ImageSchema);

