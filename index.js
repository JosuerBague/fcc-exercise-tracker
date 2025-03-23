import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./database/database.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res) => {
  await db.read();

  const user = db.users.find((user) => user.username === req.body.username);
  if (!user) {
    await db.update(({ users }) => users.push({}));
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
