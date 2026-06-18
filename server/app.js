import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import taskRoutes from "./routes/taskRoutes.js"
import { configDotenv } from 'dotenv';






const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
configDotenv();


app.get("/", (req, res) => {
    res.send("AWS Learning Project Running");
});

// User Routes
app.use("/api/user", userRoutes);
app.use("/api/tasks", taskRoutes );

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});