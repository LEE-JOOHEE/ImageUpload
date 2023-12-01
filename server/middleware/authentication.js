const mongoose = require("mongoose");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  const { sessionid } = req.headers;
  
  if(!sessionid || !mongoose.isValidObjectId(sessionid)) return next(); //세션 아이디유형 벨리 체크

  const user = await User.findOne({ 'sessions._id': sessionid });
  if(!user) return next();
  req.user = user;
  return next();
}

module.exports = { authenticate };