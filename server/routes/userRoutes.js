// import express from "express";
// import { loginUser, registerUser } from "../controllers/controllers.js";
// 
// const router = express.Router();
// router.get("/test", (req, res) => {
//     res.json({
//         success: true,
//         message: "User Route Working"
//     });
// });
// 
// router.post("/register", registerUser);
// router.post("/login",loginUser);
// 
// 
// export default router;
import express from "express";
import {
    loginUser,
    registerUser,
    verifyOTP,
    logoutUser,
    getMe,
    getEmployees
} from "../controllers/controllers.js";
import { protect } from '../middleware/authmiddleware.js';
import { isAdmin } from '../middleware/adminmiddleware.js';

// import { protect } from "../middleware/authMiddleware.js";
// import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "User Route Working"
    });
});

// Public Routes
router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);

// Protected Routes
router.post("/logout", protect, logoutUser);

router.get("/me", protect, getMe);

// Admin Only Routes
router.get(
    "/employees",
    protect,
    isAdmin,
    getEmployees
);

export default router;