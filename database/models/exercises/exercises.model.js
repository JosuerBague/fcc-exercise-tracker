import mongoose, { mongo } from "mongoose";
import { User } from "../models.js";

const exerciseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    default: () => new Date().toDateString(),
  },
});

const Excercise = mongoose.model("Excercise", exerciseSchema);
export { Excercise };
