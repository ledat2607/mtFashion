const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../model/user");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
//Create user
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { surName, name, email, password, userName, phoneNumber } = req.body;
    const userEmail = await User.findOne({ email });
    const duplicateUserName = await User.findOne({ userName });
    const duplicatePhone = await User.findOne({ phoneNumber });
    if (
      surName === "" ||
      name === "" ||
      email === "" ||
      password === "" ||
      phoneNumber === "" ||
      userName === ""
    ) {
      return next(new ErrorHandler("Vui lòng điền đầy đủ thông tin", 400));
    }
    if (userEmail) {
      return next(new ErrorHandler("Email đã được đăng ký!", 400));
    }
    if (duplicateUserName) {
      return next(new ErrorHandler("Tên người dùng đã tồn tại!", 401));
    }
    if (duplicatePhone) {
      return next(new ErrorHandler("Số điện thoại đã được đăng ký!", 402));
    }
    let avatar = {};
    if (req.file) {
      const filename = req.file.filename;
      const fileUrl = path.join(filename);
      avatar = {
        public_id: fileUrl,
        url: fileUrl,
      };
    } else {
      avatar = {
        public_id: "",
        url: "",
      };
    }

    const user = {
      surName: surName,
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      password: password,
      userName: userName,
      avatar: avatar,
    };
    const newUser = await User.create(user);
    res.status(200).json({
      success: true,
      message: "Đăng ký thành công !",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message), 400);
  }
});
module.exports = router;
