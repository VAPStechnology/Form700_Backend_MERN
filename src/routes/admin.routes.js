import { Router } from "express";
import { logOutAdmin, loginAdmin, registerAdmin } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/adminAuth.middleware.js";

const router = new Router();

router.route("/registerAdmin").post(registerAdmin)
router.route("/loginAdmin").post(loginAdmin)


///secured routes
router.route("/logoutAdmin").post(verifyJWT,logOutAdmin)




export default router;



