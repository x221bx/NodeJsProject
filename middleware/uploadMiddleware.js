import multer from "multer"; //libraryto add image  - express 
const storage = multer.memoryStorage(); 
export const upload = multer({ storage });