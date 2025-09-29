// models/commentModel.js
import { db } from "../config/firebase.js";

const commentsCollection = (postId) => db.collection("posts").doc(postId).collection("comments");

export async function createComment({ postId, userId, content }) {
    const now = new Date();
    const data = { postId, userId, content, createdAt: now, updatedAt: now };
    const ref = await commentsCollection(postId).add(data);
    return { id: ref.id, ...data };
}

export async function listComments(postId, limit = 20) {
    const snap = await commentsCollection(postId).orderBy("createdAt", "desc").limit(limit).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getComment(postId, commentId) {
    const doc = await commentsCollection(postId).doc(commentId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

export async function updateComment(postId, commentId, content) {
    const ref = commentsCollection(postId).doc(commentId);
    await ref.update({ content, updatedAt: new Date() });
    const doc = await ref.get();
    return { id: doc.id, ...doc.data() };
}

export async function deleteComment(postId, commentId) {
    await commentsCollection(postId).doc(commentId).delete();
    return { ok: true };
}
