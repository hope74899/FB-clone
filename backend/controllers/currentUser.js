export const getCurrentUser = async (req, res, next) => {
    try {
        const userData = req.user;
        if (!userData) {
            res.status(401).json({ message: "Error in current user route" });
        }
        else {
            res.status(201).json(userData);
        }
    } catch (error) {
        next(error)
    }
}