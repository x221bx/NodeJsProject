import express from "express";
import { getAllPosts, createPost, updatePost, deletePost } from "../controllers/postsControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllPosts);
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, requireRole(["user", "admin"]), upload.single("image"), updatePost);
router.delete("/:id", authMiddleware,  deletePost);

export const postRouter = router;

// requireRole(["user", "admin"]),
// requireRole(["user", "admin"]), upload.single("image"),
