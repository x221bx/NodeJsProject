import express from "express";
import { getAllPosts, createPost, updatePost, deletePost } from "../controllers/postsControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllPosts);
router.post("/", authMiddleware, requireRole(["user", "admin"]), upload.single("image"), createPost);
router.put("/:id", authMiddleware, requireRole(["user", "admin"]), upload.single("image"), updatePost);
router.delete("/:id", authMiddleware, requireRole(["user", "admin"]), deletePost);

export const postRouter = router;