const { Router } = require("express");
const userRouter = Router();
const User = require("../models/User");
const { hash, compare } = require("bcryptjs");
const Image = require("../models/Image");

// 가입
userRouter.post("/register", async (req, res) => {
  try {
    
    if(req.body.password.length < 6) 
      throw new Error("비밀번호를 6자 이상으로 해주세요.")
    if(req.body.username.length < 3) 
      throw new Error("usernmae은 3자 이상으로 해주세요.");
    
    const hashedPassword = await hash(req.body.password, 10);
    const user = await new User({
      name: req.body.name,
      username: req.body.username,
      hashedPassword,
      sessions: [{ createdAt: new Date() }] //세션추가(가입시 바로 로그인 될수 있도록)
    }).save();

    const session = user.sessions[0];
    res.json({ 
      message: "user registerd",
      sessionId: session._id,
      name: user.name,
      userId: user._id,
    });

  } catch (err) {
    res.status(400).json({ message: err.message + "eeeee" });
  }
});

// 로그인
userRouter.patch("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if(!user) throw new Error("ID가 올바르지 않습니다.");
    const isValid = await compare(req.body.password, user.hashedPassword);
    if (!isValid) throw new Error("입력하신 정보가 올바르지 않습니다.");

    // 세션추가(로그인 기기가 많을수 있으므로 세션은 배열)
    user.sessions.push({ createdAt: new Date() });
    const session = user.sessions[user.sessions.length-1];
    await user.save();

    res.json({ 
      message: "user validated", 
      sessionId: session._id, 
      name: user.name,
      userId: user._id,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 로그아웃 API
userRouter.patch("/logout", async (req, res) => {
  try {
    // 미들퉤어추가
    console.log(req.user);
    if(!req.user) throw new Error("invalid sessionid.");
    await User.updateOne(
      { _id: req.user.id }, 
      { $pull: { sessions: {_id: req.headers.sessionid} } }
    );
    res.json({ message: "user is logged out" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 유저 정보 가져오는 API
userRouter.get("/me", (req, res) => {
  try {
    if(!req.user) throw new Error("권한이 없습니다.");
    res.json({
      message: "success",
      sessionId: req.headers.sessionid,
      name: req.user.name,
      userId: req.user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/me/images", async (req, res) => {
  //본인 권한의 사진만 리턴 (public === false)
  try {
    if(!req.user) throw new Error("권한이 없습니다. vvvvv");
    const images = await Image.find({ "user._id" : req.user.id });
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }

});

module.exports = { userRouter };