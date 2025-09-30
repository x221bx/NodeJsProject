import { collection } from "firebase/firestore";
import { db } from "../config/firebase.js";

const postsCollection = collection(db, "posts");

export default postsCollection;
