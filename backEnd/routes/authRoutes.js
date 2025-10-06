import express from 'express'
import { createNewUser, login } from '../controllers/authControllers.js';
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route('/register').post(upload.single("image"),createNewUser)
router.route('/login').post(login)

export const authRouter = router;