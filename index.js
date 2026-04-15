import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan";
import fs from "fs";
import path from "path";
import connectDB from "./config/masterdb.js";

dotenv.config();

const logStream = fs.createWriteStream(
  path.join("logs", "error.log"),
  { flags: "a" }
);

import adminrouter from './Routes/admin/Api.js';
import branchrouter from './Routes/Api.js';

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(morgan("combined", { stream: logStream }));

app.use('/api', adminrouter);
app.use('/api', branchrouter);


app.use((err, req, res, next) => {
  const errorMessage = `${new Date()} - ${err.stack}\n`;

  fs.appendFileSync("logs/error.log", errorMessage);

  res.status(500).json({
    status: false,
    message: err.message || "Internal Server Error"
  });
});

app.get('/', (req, res) => {
  res.send("SERVER IS RUNING APP GARAGE ")
});

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`SERVER RUNING ON http://0.0.0.0:${process.env.PORT}`);
})