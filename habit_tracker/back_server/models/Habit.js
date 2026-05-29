import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["health", "education", "productivity", "mindfulness"],
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    streak: {
      type: Number,
      default: 0,
    },

    bestStreak: {
      type: Number,
      default: 0,
    },

    totalCompletions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;
