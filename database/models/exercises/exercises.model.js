import mongoose, { mongo } from "mongoose";
import { User } from "../models";

const exerciseSchema = new mongoose.Schema({
  username: {
    type: User.username,
    ref: "User",
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
    type: Date,
    default: () => Date.now(),
  },
});

const Excercise = mongoose.model("Excercise", exerciseSchema);
export { Excercise };
