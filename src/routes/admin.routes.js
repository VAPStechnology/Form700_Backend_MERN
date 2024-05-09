import { Router } from "express";
import { loginAdmin, registerAdmin } from "../controllers/admin.controller.js";

const router = new Router();

router.route("/registerAdmin").post(registerAdmin)
router.route("/loginAdmin").post(loginAdmin)





export default router;



