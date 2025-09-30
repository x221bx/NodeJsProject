import postsCollection from "../models/postsModel.js";
import { addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";

// Read All Posts
export const getAllPosts = async (req, res) => {
  try {
    const snapshot = await getDocs(postsCollection);
    const posts = [];
    snapshot.forEach((doc) => posts.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Create Post
export const createPost = async (req, res) => {
  try {

    const { title, content } = req.body; 
    const authorId = req.user.id;
    const docRef = await addDoc(postsCollection, { title, content, authorId });


    res.status(201).json({ id: docRef.id, title, content, authorId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update Post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;
    const role = req.user.role || "user";
    const postRef = doc(postsCollection.firestore, "posts", id);
    const postSnap = await getDoc(postRef);


    if (!postSnap.exists()) return res.status(404).json({ error: "Post not found" });
    const postData = postSnap.data();
    if (postData.authorId !== userId && role !== "admin") 
      return res.status(403).json({ message: "Not allowed" });
    await updateDoc(postRef, { title, content });
    res.status(200).json({ message: "Post updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Delete Post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role || "admin";
    const postRef = doc(postsCollection.firestore, "posts", id); // refrence
    const postSnap = await getDoc(postRef);

    
    if (!postSnap.exists()) return res.status(404).json({ error: "Post not found" });
    const postData = postSnap.data();
    if (postData.authorId !== userId && role !== "admin")
      return res.status(403).json({ message: "Not allowed" });
    await deleteDoc(postRef);
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
