const User = require("../models/User.js");
const ErrorResponse = require("../utils/errorResponse.js");

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 404));
    }

    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 404));
    }

    res.status(201).json({
      success: true,
      token: "TOKENTOKEN",
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = (req, res, next) => {
  res.send("forgotPassword Route");
};

exports.resetPassword = (req, res, next) => {
  res.send("resetPassword Route");
};
