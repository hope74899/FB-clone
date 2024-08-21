import { Schema, model, mongoose } from "mongoose";

// Post Schema
const postSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'SignupUser',
            default: []
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        }
    ],
});

const Post = model('Post', postSchema);

// Comment Schema
const commentSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Include this for consistency
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
});

const Comment = model('Comment', commentSchema);

export { Post, Comment };
