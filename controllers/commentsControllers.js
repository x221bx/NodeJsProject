 import { createComment, listComments, getComment, updateComment, deleteComment } from "../models/commentsModel.js";

export async function create(req, res) {
    try {
        const { postId } = req.params;
        const content = (req.body?.content || "").trim();
        if (!content) return res.status(400).json({ error: "Content is required" });

        const newComment = await createComment({ postId, userId: req.user.id, content });
        res.status(201).json(newComment);
    } catch (e) {
        res.status(500).json({ error: "Failed to create comment" });
    }
}

export async function list(req, res) {
    try {
        const { postId } = req.params;
        const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
        const comments = await listComments(postId, limit);
        res.json(comments);
    } catch (e) {
        res.status(500).json({ error: "Failed to list comments" });
    }
}

export async function getOne(req, res) {
    try {
        const { postId, commentId } = req.params;
        const comment = await getComment(postId, commentId);
        if (!comment) return res.status(404).json({ error: "Comment not found" });
        res.json(comment);
    } catch (e) {
        res.status(500).json({ error: "Failed to get comment" });
    }
}

export async function update(req, res) {
    try {
        const { postId, commentId } = req.params;
        const content = (req.body?.content || "").trim();
        if (!content) return res.status(400).json({ error: "Content is required" });

        const existingComment = await getComment(postId, commentId);
        if (!existingComment) return res.status(404).json({ error: "Comment not found" });
        if (existingComment.userId !== req.user.id) return res.status(403).json({ error: "Forbidden" });

        const updatedComment = await updateComment(postId, commentId, content);
        res.json(updatedComment);
    } catch (e) {
        res.status(500).json({ error: "Failed to update comment" });
    }
}

export async function remove(req, res) {
    try {
        const { postId, commentId } = req.params;

        const existingComment = await getComment(postId, commentId);
        if (!existingComment) return res.status(404).json({ error: "Comment not found" });
        if (existingComment.userId !== req.user.id) return res.status(403).json({ error: "Forbidden" });

        await deleteComment(postId, commentId);
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: "Failed to delete comment" });
    }
}
