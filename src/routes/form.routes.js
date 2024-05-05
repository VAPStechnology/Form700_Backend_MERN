import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {createForm, formCount } from "../controllers/form.controller.js";



const router = new Router();

router.route("/createForm").post(verifyJWT,createForm);
router.route("/user/:userId/form-submissions/count").get(verifyJWT,formCount)


export default router;

