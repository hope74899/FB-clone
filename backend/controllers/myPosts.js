import { Post } from "../models/post.js";
import SignupUser from "../models/login.js";

const getposts = async (req, res) => {
    try {
        const userId = req.params.userId; // Get the userName from request parameters
        const getPost = await Post.find({ userId: userId }); // Use the correct field in your Post model
        // console.log(getPost);
        res.status(200).json(getPost);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Server error while fetching posts" });
    }
};

export default getposts;
