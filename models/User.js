/** @format */

const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
    /* required : whithout username wa can't create any user 
    unique : can not create any other user with same username */
  },
  { timestamps: true }
  // create createdAt and updatedAT times
)

module.exports = mongoose.model('User', UserSchema)
