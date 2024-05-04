import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {createForm } from "../controllers/form.controller.js";
import { User } from "../models/user.model.js";
import { Forms } from "../models/form.model.js";



const router = new Router();

router.route("/createForm").post(verifyJWT,createForm);
router.route("/user/:userId/form-submissions/count").get(async(req,res)=>{
    try {
        const username = req.params.userId;

        const user = await User.findOne({username}).exec()

        // console.log(req)

        // MongoDB aggregation query to count form submissions by user
        const count = await Forms.aggregate([
            { $match: { user: user._id } },
            { $count: 'total' }
        ]);

        console.log(count)

        res.json({ count: count.length > 0 ? count[0].total : 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


export default router;

