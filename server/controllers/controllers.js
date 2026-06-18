import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { sendOTP } from "../utils/sendEmail.js";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const [existingUser] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        const [result] = await pool.query(
            `
            INSERT INTO users
            (name,email,password,role,is_verified,otp,otp_expires)
            VALUES (?,?,?,?,?,?,?)
            `,
            [
                name,
                email,
                hashedPassword,
                role || "employee",
                false,
                otp,
                otpExpires
            ]
        );

        // Send Email
        await sendOTP(email, otp);

        res.status(201).json({
            success: true,
            message: "User Registered. Please verify your email.",
            userId: result.insertId
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const [users] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const user = users[0];

        if (user.is_verified) {
            return res.status(400).json({ success: false, message: "User is already verified" });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (new Date() > new Date(user.otp_expires)) {
            return res.status(400).json({ success: false, message: "OTP has expired" });
        }

        await pool.query(
            "UPDATE users SET is_verified = ?, otp = NULL, otp_expires = NULL WHERE email = ?",
            [true, email]
        );

        res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = users[0];

        if (!user.is_verified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getMe = async (req, res) => {
    const [users] = await pool.query(
        "SELECT id,name,email,role,is_verified FROM users WHERE id=?",
        [req.user.id]
    );

    res.status(200).json({
        success: true,
        user: users[0]
    });
};

export const getEmployees = async (req, res) => {
    const [employees] = await pool.query(
        `SELECT id,name,email FROM users WHERE role='employee'`
    );

    res.status(200).json({
        success: true,
        employees
    });
};

export const logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({
        success: true,
        message: "Logout Successful"
    });
};