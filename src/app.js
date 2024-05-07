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


//routes import.....

import userRouter from "./routes/user.routes.js"
import formRouter from "./routes/form.routes.js"
import adminRouter from "./routes/admin.routes.js"



// routes declearation...

app.use ("/api/v1/users", userRouter)
app.use("/api/v1/forms", formRouter)
app.use("/api/v1/admins", adminRouter)


export default app;

