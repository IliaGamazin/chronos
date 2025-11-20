import express from "express";
import cookies from "cookie-parser";
import cors from 'cors';
import mongoose from "mongoose";

import router from "./routers/BaseRouter.js";

import { createServer } from "node:http";
import { config } from "dotenv";
import { error_handler } from "./middleware/ErrorHandler.js";

config();
await mongoose.connect(process.env.DB_CONNECTION);

const app = express();
const http = createServer(app);
const corsOptions = {
    origin: true,
    credentials: true
};

app.use(cors(corsOptions));
app.use(cookies());
app.use(express.json({limit: '2mb'}));
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use(error_handler);

http.listen(process.env.PORT, () => {
    console.log("Listening on " + process.env.PORT);
});
