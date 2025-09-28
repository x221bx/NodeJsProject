import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { getAllCommnets } from '../controllers/commentsControllers.js';


const router = express.Router();


router.route('/').get(getAllCommnets)




export const commentRouter = router;