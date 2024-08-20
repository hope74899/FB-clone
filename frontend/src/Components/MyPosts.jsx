import { useState, useEffect } from "react";
import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
import { CgProfile } from "react-icons/cg";
import { BiLike } from "react-icons/bi";
import { TbMessageCircle } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { useAuth } from "../Store/AuthToken";
import Profile from "./Profile";
import { toast } from "react-toastify";
const MyPosts = () => {
    const { user, isloggedIn } = useAuth();
    // const navigate = useNavigate();
    const [visibleComments, setVisibleComments] = useState({});
    const [posts, setPosts] = useState([])
    const [comments, setComments] = useState([])
    const [userId, setUserId] = useState('')


    const toggleVisibility = (postId) => {
        setVisibleComments(prevState => ({
            ...prevState,
            [postId]: !prevState[postId]
        }));

        // Fetch comments when opening the comments section
        if (!visibleComments[postId]) {
            getComments(postId);
        }
    };
    useEffect(() => {
        if (user) {
            setUserId(user._id);  // Set the user name
            if (user._id) {  // Use user.name directly
                getPostsData(user._id);  // Fetch posts using the userName                
            } else {
                alert('User ID not found');
            }
        }
    }, [user]);  // Only depend on user
    const getPostsData = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/myposts/${userId}`);
            if (response.status) {
                setPosts(response.data)
            }
            else {
                alert("Error while getting  Post")
            }

        } catch (error) {
            console.error('clintside error', error);
        }
    };
    const deletePost = async (postId, userId) => {
        if (!isloggedIn) return;
        try {
            const response = await axios.delete(`http://localhost:5000/posts/delete/${postId}`);
            if (response.status) {
                toast.success(response.data.details ? response.data.details : response.data.message)
                getPostsData(userId);
            }
            else {
                toast.error(response.data.details ? response.data.details : response.data.message)
            }

        }
        catch (error) {
            toast.error('An error occurred while deleting post.');
            console.log('An error occurred while deleting post : ', error);
        }
    };
    const getComments = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:5000/getcomment/${postId}`);
            if (response.status) {
                setComments(response.data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    };
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (error) {
            console.error('Error formatting date', error);
            return 'Invalid date';
        }
    };

    return (
        <div className="flex bg-gray-100">
            <Profile />
            <div className="flex flex-col w-3/4 p-4">
                {posts.map((post, index) => (
                    <div key={index} className="bg-white text-black py-4 px-6 shadow-lg min-h-40 w-2/5 mx-auto mb-4">
                        <div className="flex justify-between items-center pb-2 mb-4">
                            <div className="flex items-center space-x-2">
                                {user.profileImage ? (<img
                                    className="w-12 h-12 rounded-full cursor-pointer shadow-lg"
                                    src={user.profileImage}
                                    alt="Profile"
                                />) : (<CgProfile className="text-4xl" />)}

                                <h3 className="text-lg font-semibold text-gray-700">{post.userName}</h3>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                                <p className="text-gray-500 text-sm">{formatDate(post.createdAt)}</p>
                                <div className="relative group">
                                    <button onClick={() => { deletePost(post._id, post.userId) }}>
                                        <MdDeleteOutline className="text-2xl" />
                                    </button>
                                    <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 p-2 w-max bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        Delete
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4 min-h-32">
                            <p className="text-gray-700">{post.content}</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-500 pt-2 text-xs">
                            <div>
                                <button className="flex items-center px-4 ">
                                    20 <BiLike className="ml-1" />
                                </button>
                            </div>
                            <div className="flex items-center" >
                                <button className="flex items-center  px-4 ">
                                    <span className="mr-1">{post.comments.length}</span> Comments
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <button className="flex items-center font-semibold py-2 px-4 rounded transition duration-300">
                                    <BiLike className="mr-1" /> Like
                                </button>
                            </div>
                            <div className="flex items-center">
                                <button onClick={() => toggleVisibility(post._id)} className="flex items-center font-semibold py-2 px-4 rounded transition duration-300">
                                    <TbMessageCircle className="mr-1" /> Comment
                                </button>
                            </div>
                        </div>
                        {visibleComments[post._id] && (
                            <>
                                {comments.map((comment, index) => (
                                    <div key={index} className="flex flex-col min-h-28 w-full mt-2">
                                        <div className="flex items-center space-x-1">
                                            <div className="flex items-center">
                                                <CgProfile className="text-gray-700 text-2xl" />
                                            </div>
                                            <div>
                                                <h2 className="text-md font-semibold text-gray-700">{comment.userName}</h2>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="px-7">{comment.comment}</p>
                                        </div>
                                    </div>
                                ))}
                                <div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>


    )
}

export default MyPosts
