import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("Database connection successful"))
      .catch(() => console.error("Database connection error"));
  }
}

const db = new Database();

export { db };
