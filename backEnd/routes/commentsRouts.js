import { Router } from "express";
import * as CommentController from "../controllers/commentsControllers.js";

const router = Router();

router.post("/:postId", CommentController.createComment);
router.get("/:postId", CommentController.listComments);
router.get("/:postId/:commentId", CommentController.getComment);
router.patch("/:postId/:commentId", CommentController.updateComment);
router.delete("/:postId/:commentId", CommentController.deleteComment);

export const commentRouter = router;
