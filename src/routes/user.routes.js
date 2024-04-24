import { Router} from 'express';
import { registrUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
const router = new Router();

router.route('/register').post(
    upload.fields([
        { name: 'avatar', maxCount: 1}
    ]),
    registrUser
    )

export default router;

