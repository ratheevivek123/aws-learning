import express from "express";

import {
    createTask,
    getAllTasks,
    getMyTasks,
    updateTaskStatus
} from "../controllers/taskController.js";
import { protect } from '../middleware/authmiddleware.js';
import { isAdmin } from '../middleware/adminmiddleware.js';



const router = express.Router();

router.get(
    "/all",
    protect,
    isAdmin,
    getAllTasks
);

router.post(
    "/create",
    protect,
    isAdmin,
    createTask
);

router.get(
    "/my-tasks",
    protect,
    getMyTasks
);

router.put(
    "/status/:taskId",
    protect,
    updateTaskStatus
);

export default router;