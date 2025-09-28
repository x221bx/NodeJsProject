import express from 'express'
import { deleteUser, getAllUsers, getUserById, udatedUser } from '../controllers/userControllers.js';

const router = express.Router();


router.route('/').get(getAllUsers)
router.route('/:id').get(getUserById).put(udatedUser).delete(deleteUser)



export const userRouter = router;