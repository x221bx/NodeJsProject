import express from 'express'
import { deleteUser, getAllUsers, getCurrentUser, getUserById, udatedUser } from '../controllers/userControllers.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();


router.route('/').get(getAllUsers)
router.route('/me').get(authMiddleware, getCurrentUser)
router.route('/:id').get(getUserById).put(udatedUser).delete(deleteUser)



export const userRouter = router;