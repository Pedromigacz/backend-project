const ErrorResponse = require("../utils/errorResponse.js");
const Travel = require("../models/Travel.js");
const mongoose = require("mongoose");
const User = mongoose.model("User");

exports.getTravel = async (req, res, next) => {
  let travel;
  try {
    travel = await Travel.findById(req.params.travelId);
  } catch (error) {
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: travel,
  });
};

exports.postTravel = async (req, res, next) => {
  if (!req.body || !req.body.travel) {
    return next(new ErrorResponse("missing travel", 400));
  }

  const travel = req.body.travel;

  let savedTravel;

  try {
    const owner = await User.findOne({ email: travel.ownerEmail });

    if (!owner) {
      return next(new ErrorResponse("Owner not found", 404));
    }

    savedTravel = await Travel.create({
      name: travel.name,
      location: travel.location,
      date: travel.date,
      comments: travel.comments,
      owner: mongoose.Types.ObjectId(owner._id),
    });
  } catch (error) {
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: "travel created successfully",
    travelId: savedTravel._id,
  });
};

exports.putTravel = async (req, res, next) => {
  if (!req.body || !req.body.travel) {
    return next(new ErrorResponse("missing travel", 400));
  }
  if (!req.params.travelId) {
    return next(new ErrorResponse("missing travelId", 400));
  }

  try {
    const travel = await Travel.findById(req.params.travelId);

    if (!travel) {
      return next(new ErrorResponse("travel not found", 400));
    }

    travel.name = req.body.travel.name ? req.body.travel.name : travel.name;
    travel.location = req.body.travel.location
      ? req.body.travel.location
      : travel.location;
    travel.date = req.body.travel.date ? req.body.travel.date : travel.date;
    travel.comments = req.body.travel.comments
      ? req.body.travel.comments
      : travel.comments;

    await travel.save();
  } catch (error) {
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: "travel updated successfully",
  });
};

exports.deleteTravel = async (req, res, next) => {
  if (!req.params.travelId) {
    return next(new ErrorResponse("missing travel", 400));
  }

  try {
    const travel = await Travel.findById(req.params.travelId);

    if (!travel) return next(new ErrorResponse("travel not found", 404));

    await travel.remove();
  } catch (error) {
    return next(error);
  }
  res.status(200).json({
    success: true,
    data: "travel deleted successfully",
  });
};

exports.getUserTravels = async (req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorResponse("missing owner email travel", 400));
  }

  try {
    const owner = await User.findOne({ email: req.body.email });

    if (!owner) return next(new ErrorResponse("user not found", 404));

    await owner.populate("listOfTravels").execPopulate();

    res.status(200).json({ success: true, travels: [...owner.listOfTravels] });
  } catch (error) {
    return next(error);
  }
};

exports.getOwnerTravels = async (req, res, next) => {
  if (!req.user._id) {
    return next(new ErrorResponse("Something went wrong", 500));
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) return next(new ErrorResponse("user not found", 404));

    await user.populate("listOfTravels").execPopulate();

    res.status(200).json({ success: true, travels: [...user.listOfTravels] });
  } catch (error) {
    return next(error);
  }
};
