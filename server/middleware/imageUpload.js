const multer = require('multer');
const { v4: uuid } = require('uuid');
const mime = require('mime-types');

// 업로드 부분
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => 
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
})

const upload = multer({ 
  storage, 
  fileFilter: (req, file, cb) => {
    // mimetype으로 jpeg, jpg, png 타입 확인 후 true, 아니면 에러와 함께 false 처리
    if(['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) cb(null, true);
    // 영문 에러 : invalid file type.
    else cb(new Error("파일형식이 올바르지 않습니다."), false);
  },
  limits: {
    // 이미지 사이즈 5KB로 제어
    fileSize: 1024 * 1024 * 5,
  }
});

module.exports = { upload };