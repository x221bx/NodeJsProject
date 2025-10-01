// routes/commentsRoutes.js
import { Router } from "express";
import * as CommentController from "../controllers/commentsControllers.js";

const router = Router();

 router.post("/:postId", CommentController.create);           // POST /api/comments/:postId
router.get("/:postId", CommentController.list);              // GET /api/comments/:postId
router.get("/:postId/:commentId", CommentController.getOne); // GET /api/comments/:postId/:commentId
router.patch("/:postId/:commentId", CommentController.update); // PATCH /api/comments/:postId/:commentId
router.delete("/:postId/:commentId", CommentController.remove); // DELETE /api/comments/:postId/:commentId

export const commentRouter = router;
