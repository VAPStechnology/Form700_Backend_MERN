import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();




app.use(cors({
    origins: process.env.CORS_ORIGINS,
    credentials: true
}));

app.use(express.json({ limit: '50mb'})); // body parser middleware
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.static('public'))
app.use(cookieParser());

export default app;

