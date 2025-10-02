import express from "express"
import { userRouter } from "./routes/userRoutes.js";
import { authRouter } from "./routes/authRoutes.js";
import { postRouter } from "./routes/postsRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { commentRouter } from "./routes/commentsRouts.js";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use((req, res, next) => {
    console.log("Hello From the Middleware");
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)


app.use('/api/posts', authMiddleware, postRouter)
app.use('/api/comments', authMiddleware,commentRouter)
export default app;

