require('dotenv').config();
const mongoose = require("mongoose");
const express = require('express');
const { imageRouter } = require("./routes/imageRouter");
const { userRouter } = require("./routes/userRouter");

const app = express();
const { MONGO_URI, PORT } = process.env; 

const { authenticate } = require("./middleware/authentication");

// console.log(process.env)
mongoose
  .connect(
    MONGO_URI,
    // {
    //   useUnifiedTopology: true,
    //   useNewUrlParser: true,
    //   useCreateIndex: true,
    // }
  )
  .then(() => {
    console.log("MongoDB Connected.")

    // 순서가 중요함!!!
    app.use("/uploads", express.static("uploads"))
    app.use(express.json()) // json 형식으로 파싱
    app.use(authenticate);
    app.use("/images", imageRouter);
    app.use("/users", userRouter);
    app.listen(PORT, () => console.log("Express sever listening on PORT " + PORT));

  })
  .catch((err) => console.log(err));