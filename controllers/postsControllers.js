import postsCollection from "../models/postsModel.js";
import { addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase.js";
// upload image to firebase storage and return the URL
const handleImage = async (file) => {
  if (!file) return null;
  const imageRef = ref(storage, `posts/${Date.now()}_${file.originalname}`); //save-data-picName
  await uploadBytes(imageRef, file.buffer);  //up-info
  return await getDownloadURL(imageRef);     //get-url
};

// read all posts
export const getAllPosts = async (req, res) => {
  try {
    const snapshot = await getDocs(postsCollection);
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// createPost
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;
    const imageUrl = await handleImage(req.file);
    const docRef = await addDoc(postsCollection, { title, content, authorId, imageUrl });

    res.status(201).json({ id: docRef.id, title, content, authorId, imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// updated post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const { id: userId, role = "user" } = req.user;
    const postRef = doc(postsCollection.firestore, "posts", id);
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) return res.status(404).json({ error: "Post not found" });

    const postData = postSnap.data();

    if (postData.authorId !== userId && role !== "admin")
      return res.status(403).json({ message: "Not allowed" });

    const imageUrl = await handleImage(req.file);
    const updatedData = { title, content, ...(imageUrl && { imageUrl }) };

    await updateDoc(postRef, updatedData);
    res.status(200).json({ message: "Post updated", ...updatedData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId, role = "admin" } = req.user;
    const postRef = doc(postsCollection.firestore, "posts", id);
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