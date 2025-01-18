import express from "express"; const router = express.Router();
import { createPost, getPost, deletePost, getLikes } from "../controllers/posts.js";
import getposts from "../controllers/myPosts.js";
import { createComment, getComment, deleteComment } from "../controllers/Comments.js";
import { CreateUser, getUsers, loginUser, deleteuser } from "../controllers/signup.js";
import { updateUser } from "../controllers/profile.js";
import { getCurrentUser } from "../controllers/currentUser.js";
import { signup, login } from "../zod schema/login-validators.js";
import validate from "../middleware/login-auth.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import authmidddleware from "../middleware/token-auth.js";
import errorMiddleware from "../middleware/errorMiddleware.js";
import uploadFiles from "../middleware/multer-middleware.js";
import { allusers, acceptFriendRequest, declineFriendRequest, getUserFriendRequests, getUserFriends, sendFriendRequest } from "../controllers/friends.js";
import { sendMessage, getMessages } from '../controllers/messageController.js'



router.post("/createpost", createPost);
router.get("/getpost", getPost);
router.delete("/posts/delete/:postId", deletePost);
router.get("/myposts/:userId", getposts);
router.post("/likePost/:postId", authmidddleware, getLikes);

router.post("/createcomment", createComment);
router.get("/getcomment/:postId", getComment);
router.delete("/comments/delete/:commentId", deleteComment);

router.post("/signup", validate(signup), errorMiddleware, uploadFiles, CreateUser);
router.put("/profile/update", uploadFiles, updateUser);
router.post("/login", validate(login), errorMiddleware, loginUser);
router.get("/admin/users", authmidddleware, adminMiddleware, getUsers);
router.delete("/admin/users/delete/:userId", authmidddleware, adminMiddleware, deleteuser);

router.get("/user", authmidddleware, getCurrentUser);
router.get("/allusers/:userid", allusers);
router.get("/:userId/friends", getUserFriends);
router.get("/:userId/friend-requests", getUserFriendRequests);
router.post("/:userId/friend-request/:targetUserId", sendFriendRequest);
router.post("/:userId/accept-friend-request/:requesterId", acceptFriendRequest);
router.delete("/:userId/decline-friend-request/:requesterId", declineFriendRequest);

router.post('/send-message', sendMessage);
// Route to get messages between two users
router.get('/messages/:userId/:friendId', getMessages);



export default router;
