import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
    try {

        let token = null;

        // Cookie se token lo
        if (req.cookies?.token) {
            token = req.cookies.token;
        }

        // Authorization header se bhi support
        if (
            !token &&
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please login."
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token"
        });

    }
};