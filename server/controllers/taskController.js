import pool from "../config/db.js";

export const createTask = async (req, res) => {
    try {

        const {
            title,
            description,
            priority,
            deadline,
            assigned_to
        } = req.body;

        if (
            !title ||
            !assigned_to
        ) {
            return res.status(400).json({
                success: false,
                message: "Title and Assigned Employee are required"
            });
        }

        const [employee] = await pool.query(
            `
            SELECT id,name,email
            FROM users
            WHERE id = ?
            AND role = 'employee'
            `,
            [assigned_to]
        );

        if (employee.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        const [result] = await pool.query(
            `
            INSERT INTO tasks
            (
                title,
                description,
                priority,
                deadline,
                created_by,
                assigned_to
            )
            VALUES (?,?,?,?,?,?)
            `,
            [
                title,
                description,
                priority || "medium",
                deadline || null,
                req.user.id,
                assigned_to
            ]
        );

        res.status(201).json({
            success: true,
            message: "Task Created Successfully",
            taskId: result.insertId
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
export const getAllTasks = async (req, res) => {

    try {

        const [tasks] = await pool.query(
            `
            SELECT
            t.*,
            u.name as employee_name
            FROM tasks t
            JOIN users u
            ON t.assigned_to = u.id
            ORDER BY t.created_at DESC
            `
        );

        res.status(200).json({
            success: true,
            tasks
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
export const getMyTasks = async (req, res) => {

    try {

        const [tasks] = await pool.query(
            `
            SELECT *
            FROM tasks
            WHERE assigned_to = ?
            ORDER BY created_at DESC
            `,
            [req.user.id]
        );

        res.status(200).json({
            success: true,
            tasks
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
export const updateTaskStatus = async (req, res) => {

    try {

        const { taskId } = req.params;

        const { status } = req.body;

        const allowedStatus = [
            "pending",
            "in_progress",
            "completed",
            "approved",
            "rejected"
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Status"
            });
        }

    const update =    await pool.query(
            `
            UPDATE tasks
            SET status = ?
            WHERE id = ?
            `,
            [
                status,
                taskId
            ]
        );

        res.status(200).json({
            success: true,
            message: "Task Updated"
            ,update
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};