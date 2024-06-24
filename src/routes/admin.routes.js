import { Router } from "express";
import { deleteUser, getUser, logOutAdmin, loginAdmin, registerAdmin } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/adminAuth.middleware.js";

const router = new Router();

router.route("/registerAdmin").post(registerAdmin)
router.route("/loginAdmin").post(loginAdmin)


///secured routes
router.route("/logoutAdmin").post(verifyJWT,logOutAdmin)

router.route("/all-users").get(verifyJWT,getUser)
router.delete('/delete-user', verifyJWT,deleteUser);




export default router;



