import { Post, Comment } from '../models/post.js';
import SignupUser from '../models/login.js';
// import mongoose from 'mongoose';

const createComment = async (req, res) => {
    try {
        const { userId, userName, comment, postId } = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const user = await SignupUser.findById(userId);
        const profileImage = user.profileImage || '';
        // Create the comment
        const newComment = await Comment.create({ userName, profileImage, comment, postId });
        // Add the comment to the post's comments array
        post.comments.push(newComment._id);
        await post.save();

        res.status(201).json({
            message: 'Comment added successfully',
            comment: newComment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId).populate({
            path: 'comments',
            select: 'userName profileImage comment createdAt',
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post.comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error });
    }
};
const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Remove the comment from the post's comments array
        await Post.updateOne(
            { _id: comment.postId },
            { $pull: { comments: commentId } }
        );
        const post = await Comment.findByIdAndDelete(commentId);
        if (!post) {
            return res.status(404).json({ message: 'comment not found' });
        }
        res.status(200).json({ message: 'comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }

};

export { createComment, getComment, deleteComment };


