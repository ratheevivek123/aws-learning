import pool from "./db.js";

async function setupDatabase() {
    try {
        console.log("Checking database schema...");
        
        // Add is_verified column
        try {
            await pool.query("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE");
            console.log("Added is_verified column");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log("is_verified column already exists");
            } else {
                throw e;
            }
        }

        // Add otp column
        try {
            await pool.query("ALTER TABLE users ADD COLUMN otp VARCHAR(6) NULL");
            console.log("Added otp column");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log("otp column already exists");
            } else {
                throw e;
            }
        }

        // Add otp_expires column
        try {
            await pool.query("ALTER TABLE users ADD COLUMN otp_expires DATETIME NULL");
            console.log("Added otp_expires column");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log("otp_expires column already exists");
            } else {
                throw e;
            }
        }

        console.log("Database setup complete!");
        process.exit(0);
    } catch (error) {
        console.error("Database setup failed:", error);
        process.exit(1);
    }
}

setupDatabase();
