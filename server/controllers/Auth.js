const User = require("../models/userModel");
const Otp = require("../models/otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// otp send
exports.sendOTP = async (req, res) => {
  try {
    // fetch email from req.body
    const { email } = req.body;

    // check if User already exist
    const checkUserPresent = await User.findOne({ email });

    // if user already exist return a  response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "user already registered",
      });
    }

    // Generate OTP
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      special: false,
    });
    console("OTP Generated:", otp);

    // check unique otp or not
    const result = await OTP.findOne({
      otp: otp,
    });

    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        special: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    // create an entry for OTP
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    // return response successfully
    res.status(200).json({
      success: true,
      message: "OTP send successfully",
      otp,
    });
  } catch (error) {
    console.log("error in sending OTP".error);
    return res.status(500).json({
      success: false,
      message: "error in sending OTP",
    });
  }
};

// signUp
exports.signUp = async (req, res) => {
  try {
    // 28:00
    // data fetch from request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validate data
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    // match two password
    if (password !== confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "password and confirmPassword value doesnot match",
      });
    }

    // check user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already existing",
      });
    }

    // find most recient OTP for the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);
    // validate OTP
    if (recentOtp.length === 0) {
      // OTP not found
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp != recentOtp.otp) {
      // invalid OTP
      return res.status(400).json({
        success: false,
        message: "invalid OTP",
      });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create and entry in the DB

    const profileDetails = await profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
    });

    // return res
    return res.status(200).json({
      success: true,
      message: "User is registered",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User can not be registered. Please try again",
    });
  }
};

// login
exports.login = async (req, res) => {
  try {
    // get data req body
    const { email, password } = req.body;

    // validation data
    if (!email || !password) {
      return res.status(500).json({
        success: false,
        message: "all fields are required, please try again",
      });
    }

    // user check exist or not
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please try again.",
      });
    }

    // generate JWT, after match the password
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      // create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "logged in successfull",
      });
    }
    else{
      return res.status(401).json({
        success: false,
        message: "password is incorrect",
      })
    }


  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User do not exist. please try again...",
    });
  }
};

// change password
exports.changePassword = async (req,res) => {
  // get data from req body
  // get old password, new password, confirm new password
  // validation

  // update pw in DB
  // send mail - password updated
  // return response 
}