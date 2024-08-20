
const adminMiddleware = async (req, res, next) => {
    try {
        const adminRole = req.user.isAdmin;
        if (!adminRole) {
            res.status(401).json({ message: "That route is only availble to admin" });
            console.log("That route is only availble to admin");
        }
        next();
    } catch (error) {
        res.status(401).json({ message: "Error in Admin Middleware." });

    }
};
export default adminMiddleware;