import express from "express";
import cookies from "cookie-parser";
import cors from 'cors';

import { createServer } from "node:http";
import { config } from "dotenv";

config();

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

http.listen(8080, () => {
    console.log("Listening on 8080");
});
