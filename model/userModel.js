//user schema
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: [true, "email already exsists"],
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      unique: [true, "mobile number already exsists"],
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    collection: "User",
    timestamps: true,
  }
);
module.exports = mongoose.model("User", userSchema);
