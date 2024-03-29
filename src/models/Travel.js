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
    const owner = await mongoose.model("User").findById(this.owner);
    if (!owner) {
      next(new ErrorResponse("Owner not found", 404));
    }

    if (
      owner.listOfTravels.some(
        (travel) => travel._id.toString() === this._id.toString()
      )
    ) {
      return owner.save();
    } else {
      owner.listOfTravels.push(this._id);
      return owner.save();
    }
  } catch (error) {
    return next(error);
  }
  next();
});

TravelSchema.pre("remove", async function (next) {
  try {
    // remove this travel Id from owner retrieved document
    const owner = await mongoose
      .model("User")
      .findByIdAndUpdate(this.owner._id, {
        $pull: { listOfTravels: this._id },
      });

    // delete all services referenced in listOfServices
    this.listOfServices.map(async (service) => {
      await mongoose.model("Service").findByIdAndDelete(service._id);
    });
  } catch (error) {
    return next(error);
  }
  next();
});

const Travel = mongoose.model("Travel", TravelSchema);

module.exports = Travel;
