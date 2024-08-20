import { Post } from '../models/post.js'
import SignupUser from '../models/login.js';
export const createPost = async (req, res) => {
    try {
        const { userName, userId, content, likes, comments } = req.body;

        // Step 1: Find the user by userId to get their profile image
        const user = await SignupUser.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const profileImage = user.profileImage || ''; // Use existing profile image from user data

        // Step 2: Create the post with the retrieved profile image
        const createpost = await Post.create({
            userName,
            userId,
            content,
            likes: [],
            comments,
            profileImage
        });
        res.status(200).json({
            message: 'Post created successfully',
            post: createpost,
            postId: createpost._id.toString()
        });

    } catch (error) {
        res.status(500).json(error);
    }
};
export const getPost = async (req, res) => {
    try {
        const getPost = await Post.find();
        res.status(200).json(getPost);

    } catch (error) {
        res.status(500).json(error)
    }
};
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findByIdAndDelete(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }

};
// Toggle Like Function
export const getLikes = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;
        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (!Array.isArray(post.likes)) {
            return res.status(500).json({ message: 'Post likes field is not an array' });
        }
        // Check if the user has already liked the post
        const alreadyLiked = post.likes.includes(userId);
        if (alreadyLiked) {
            // Unlike the post
            post.likes = post.likes.filter(like => like.toString() !== userId.toString());
        } else {
            // Like the post
            post.likes.push(userId);
        }

        // Save the updated post
        await post.save();
        // Return the updated post
        res.status(200).json(post);
    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ message: 'Server error', error });
    }
};


