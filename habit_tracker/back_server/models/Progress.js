import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    completed: {
      type: Boolean,
      default: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    mood: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  },
);

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;
