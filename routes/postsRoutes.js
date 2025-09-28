import express from 'express'
import { getAllPosts } from '../controllers/postsControllers.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';


const router = express.Router();


router.route('/').get(getAllPosts)




export const postRouter = router;