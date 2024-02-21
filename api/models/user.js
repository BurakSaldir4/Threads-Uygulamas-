const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    unique: true,
    require: true,
  },
  profilePicture: {
    type: String
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  sentFollowRequests:
    [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  receviedFollowRequests: [{
    type: mongoose.Schema.Types.ObjectId, ref: "User"
  }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
})

const User = mongoose.model("User", userSchema)

module.exports = User;