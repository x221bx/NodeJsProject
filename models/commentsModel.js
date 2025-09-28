import { db } from "../config/firebase";

const commentsCollection = db.collection('comments')

export default commentsCollection