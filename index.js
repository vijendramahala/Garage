import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/masterdb.js";

dotenv.config();

import adminrouter from './Routes/admin/Api.js';

const app = express();
connectDB();

app.use(cors());

app.use('/api', adminrouter);

app.get('/', (req, res) => {
    res.send("SERVER IS RUNING APP GARAGE ")
});

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`SERVER RUNING ON http://0.0.0.0:${process.env.PORT}`);
})