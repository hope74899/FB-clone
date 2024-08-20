import jwt from 'jsonwebtoken';
import SignupUser from '../models/login.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        const jwttoken = token.replace("Bearer", "").trim();
        const currentuserdata = jwt.verify(jwttoken, process.env.PRIVATE_SECRET_KEY);
        const userData = await SignupUser.findOne({ email: currentuserdata.email }).select({
            password: 0
        });
        req.user = userData;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

export default authMiddleware;
