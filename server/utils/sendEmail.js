import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';

configDotenv();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
export const sendOTP = async (email, otp) => {
    try {
    

        const info = await transporter.sendMail({
            from: '"TaskHub Admin" <admin@taskhub.local>',
            to: email,
            subject: "Your TaskHub Verification Code",
            text: `Your verification code is: ${otp}. It will expire in 15 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
                    <h2 style="color: #4f46e5;">Welcome to TaskHub</h2>
                    <p>Please use the following verification code to complete your registration:</p>
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">This code will expire in 15 minutes.</p>
                </div>
            `,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return true;
    } catch (error) {
        console.error("Error sending email: ", error);
        return false;
    }
};
