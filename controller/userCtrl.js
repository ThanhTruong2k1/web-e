const User = require('../models/userModel');
const { generateToken } = require('../config/jwtToken');
const validateMongoDbId = require("../utils/validateMongodb");
const { generateRefreshToken } = require('../config/refreshtoken');
const jwt = require("jsonwebtoken");
// crate user
// middle xử lý các ngoại lệ bên trong không đồng bộ và chuyến chúng đến trình xử lý lỗi
const asynchandler = require('express-async-handler');
const createUser = asynchandler(async (req, res) => {
  // tìm email từ req.body 
  const findUser = await User.findOne({ email: req.body.email });
  // nếu tồn tại cái email đó thì
  if (!findUser) {
    /**
    tạo người dùng mới từ thông tin có trong req.body
     */
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    /**
    nếu có rồi thì thông báo người dùng đã tồn tại
     */
    throw new Error("User Already Exists");
  }
});
//login user
const loginUserCrl = asynchandler(async (req,res) =>{
  // lấy ra email và password để kiểm tra thông tin
  const {email,password} = req.body;
  // kiem tra nguoi dung
  const findUser = await User.findOne({email});
  if(findUser && await findUser.isPasswordMatched(password)){
    const refreshToken = await generateRefreshToken(findUser?._id);
    // update lai token
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken : refreshToken,
      },
      {new: true}

    );
    // update lai token
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 *1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else{
    throw new Error('Invalid Credentials')
  }

});
// login admin
const loginAdmin = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  //kiem tra nguoi dung admin
  const findAdmin = await User.findOne({ email });
  // kiem tra role
  if (findAdmin.role !== "admin") throw new Error("Not Authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});
// nghiem cuu
const handleRefreshToken = asynchandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});
// logout
const logout = asynchandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

//update
const updateUser = asynchandler(async (req, res) =>{
  const { _id } = req.user;
 
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

const saveAddress = asynchandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});


// get all user
const getallUser = asynchandler(async (req, res) =>{
  try {
    const getUser = await User.find();
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

//get one user
const getUser = asynchandler(async (req, res) =>{
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getUser = await User.findById(id);
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

// delete user
const deleteUser = asynchandler(async (req, res) =>{
  const { id } = req.params;
  try {
    const getUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (error) {
    throw new Error(error);
  }
});
const getWishlist = asynchandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports= {
  createUser , 
  loginUserCrl, 
  updateUser,
  getallUser, 
  getUser,
  deleteUser,
  handleRefreshToken,
  logout,
  loginAdmin,
  saveAddress,
  getWishlist,
};
