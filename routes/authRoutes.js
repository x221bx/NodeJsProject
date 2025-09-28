import express from 'express'
import { createNewUser, login } from '../controllers/authControllers.js';

const router = express.Router();

router.route('/register').post(createNewUser)
router.route('/login').post(login)

export const authRouter = router;