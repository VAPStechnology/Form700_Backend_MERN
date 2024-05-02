import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createForm } from "../controllers/form.controller.js";



const router = new Router();

router.route("/createForm").post(verifyJWT,createForm);


export default router;

