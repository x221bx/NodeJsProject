import express from "express";
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postsControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllPosts);

router.post("/",authMiddleware,requireRole(["admin", "user"]),upload.single("image"),createPost);

router.put("/:id", authMiddleware, requireRole(["admin", "user"]), updatePost);

router.delete("/:id", authMiddleware, requireRole(["admin", "user"]), deletePost);

export const postRouter = router;
