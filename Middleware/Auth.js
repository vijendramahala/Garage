import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(200).json({ status: false, message: 'Access Denied: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(200).json({ status: false, message: "Token missing" });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        res.user = decode;
        next();
    } catch (err) {
        return res.status(500).json({ status: false, message: "You have been loged Out. Please login agian." });
    }
};