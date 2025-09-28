import { db } from "../config/firebase";

const postsCollection = db.collection('posts')

export default postsCollection