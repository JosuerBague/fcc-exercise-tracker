import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { db } from "./database/database.js";
import { Excercise, User } from "./database/models/models.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();
db._connect();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
    });

    res.json(user);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  try {
    const date = new Date().toDateString();
    const user = await User.findById(req.params._id);
    const exercise = await Excercise.create({
      userId: req.params._id,
      description: req.body.description,
      duration: req.body.duration,
      date: req.body.date ? req.body.date : date,
    });

    res.json({
      _id: req.params._id,
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

app.get("/api/users/:_id/logs?[from][&to][&limit]", async (req, res) => {
  try {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    const limit = req.query.limit;

    let query = { userId: req.params._id };

    if (req.query.from || req.query.to) {
      query.$expr = {
        $and: [],
      };

      if (req.query.from && !isNaN(new Date(req.query.from))) {
        query.$expr.$and.push({
          $gte: [{ $toDate: "$date" }, new Date(req.query.from)],
        });
      }

      if (req.query.to && !isNaN(new Date(req.query.to))) {
        query.$expr.$and.push({
          $lte: [{ $toDate: "$date" }, new Date(req.query.to)],
        });
      }

      if (query.$expr.$and.length === 0) {
        delete query.$expr;
      }
    }

    let exercises = Excercise.find(query);

    if (req.query.limit) {
      exercises = exercises.limit(parseInt(limit));
    }

    const result = await exercises.exec();
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
