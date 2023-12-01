const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/imageUpload");
const fs = require("fs");
const { promisify } = require("util");
const mongoose = require("mongoose");

const fileUnlink = promisify(fs.unlink);

// upload.single("imageTest") 미들웨어 추가
imageRouter.post('/', upload.single("image"), async (req, res) => {
  // 유저 정보, public 우무 확인
  try {
    if(!req.user) throw new Error("권한이 없습니다.");

    // DB 저장 설정
    const image = await new Image({ 
      user: {
        _id: req.user.id,
        name: req.user.name,
        username: req.user.username,
      },
      public: req.body.public,
      key: req.file.filename, 
      originalFileName: req.file.originalname,
    }).save();
    res.json(image);
    // 강제로 실패 제어 할때
    // return res.status(500).json({ error: "server failure" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

 // DB에서 읽어오는 설정
 imageRouter.get("/", async (req, res) => {
  // public 이미지만 제공
  const imgaes = await Image.find({ public: true });
  res.json(imgaes);
});

// 사진 삭제
imageRouter.delete("/:imageId", async (req, res) => {
  try {
    // 유저 권한 확인
    if(!req.user) throw new Error("권한이 없습니다.");
    if(!mongoose.isValidObjectId(req.params.imageId)) 
      throw new Error("올바르지 않은 이미지ID 입니다.");

    // 1. uploads 폴더에 있는 사진 삭제
    // 2. DB에 있는 image 문서를 삭제
    const image = await Image.findOneAndDelete({ _id: req.params.imageId });
    if(!image) return res.json({ message: "요청하신 사진은 이미 삭제되었습니다." });
    await fileUnlink(`./uploads/${image.key}`);
    res.json({ message: "요청하신 이미지가 삭제되었습니다.", image });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.patch("/:imageId/like", async (req, res) => {
  try {
    // 유저 권한 확인
    if(!req.user) throw new Error("권한이 없습니다.");
    if(!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 이미지ID 입니다.");

    // like 중복 안되도록 확인
    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      // $addToSet : 중복체크 해서 추가 ($push : 중복가능 추가)
      { $addToSet: {likes: req.user.id} },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.patch("/:imageId/unlike", async (req, res) => {
  try {
    // 유저 권한 확인
    if(!req.user) throw new Error("권한이 없습니다.");
    if(!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 이미지ID 입니다.");

    // unlike 중복 취소 안되도록 확인
    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $pull: {likes: req.user.id} },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = { imageRouter };