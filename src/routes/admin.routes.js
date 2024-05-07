import { Router } from "express";
import { registerAdmin } from "../controllers/admin.controller.js";

const router = new Router();

router.route("/registerAdmin").post(registerAdmin)





export default router;



