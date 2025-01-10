const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  course: String,
  yearOfStudy: Number,
  bookmarkedProperties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
  ],
});

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
