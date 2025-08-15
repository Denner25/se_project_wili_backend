const mongoose = require("mongoose");
const validator = require("validator");

const moodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Mood name is required"],
      trim: true,
      maxlength: 30,
    },
    users: [
      {
        type: String,
      },
    ],
  },
  { _id: false }
);

const itemSchema = new mongoose.Schema(
  {
    _id: {
      // TMDb numeric ID as Mongo _id
      type: Number,
      required: [true, "_id is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    mediaType: {
      type: String,
      enum: ["movie", "tv", "anime"],
      required: [true, "Media type is required"],
    },
    poster: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          return !v || validator.isURL(v);
        },
        message: "Poster must be a valid URL",
      },
    },
    length: {
      type: String,
      default: null,
    },
    moods: {
      type: [moodSchema], // Likes-style subdocuments
      default: [],
    },
  },
  { timestamps: true, _id: false }
);

module.exports = mongoose.model("Item", itemSchema);
