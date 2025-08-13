const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const UnauthorizedError = require("../errors/unauthorized-err");
const { ERROR_MESSAGES } = require("../utils/errors");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [30, "Name must be at most 30 characters long"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Do not return password by default
    },
    avatarUrl: {
      type: String,
      default: "", // or a default DiceBear URL
    },
  },
  { timestamps: true }
);

// 🔹 Static method for login
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS)
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS)
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model("User", userSchema);
