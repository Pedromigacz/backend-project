const mongoose = require("mongoose");
const User = require("./User.js");
const ErrorResponse = require("../utils/errorResponse.js");

const TravelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  location: String,
  date: String,
  comments: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  listOfServices: [
    {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Service",
    },
  ],
});

// TRAVEL PRE HOOKS
TravelSchema.pre("save", async function (next) {
  try {
    const owner = await User.findById(this.owner);
    owner.listOfTravels.push(this._id);

    owner.save();
  } catch (error) {
    return next(error);
  }
  next();
});

TravelSchema.pre("remove", async function (next) {
  try {
    const owner = await User.findByIdAndUpdate(this.owner._id, {
      $pull: { listOfTravels: this._id },
    });
    if (!owner)
      return next(
        new ErrorResponse(
          "internal server erro, please, contact us and we'll solve this issue as soon as possible",
          500
        )
      );
    // remove this travel Id from owner retrieved document
  } catch (error) {
    return next(error);
  }
  next();
});

const Travel = mongoose.model("Travel", TravelSchema);

module.exports = Travel;
