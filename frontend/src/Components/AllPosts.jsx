import { useState, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CgProfile } from "react-icons/cg";
import { BiLike } from "react-icons/bi";
import { TbMessageCircle } from "react-icons/tb";
import { BiSolidShare } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { useAuth } from "../Store/AuthToken";
import { toast } from "react-toastify";


const AllPosts = () => {
    const { user, isloggedIn, admin, authorizationToken } = useAuth();
    const navigate = useNavigate();
    const [visibleComments, setVisibleComments] = useState({});
    const [isClicked, setIsClicked] = useState(false)
    // const [like, setLike] = useState(false)
    const [posts, setPosts] = useState([])
    const [comments, setComments] = useState([])

    const [createComments, setCreateComments] = useState({
        userId: user?._id || '',
        userName: '',
        postId: '',
        comment: ''
    })
    const [createPost, setCreatePost] = useState({
        userName: '',
        content: ''
    })
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
            setCreatePost(prev => ({
                ...prev,
                userId: user._id,
                userName: user.name,
            }));

            setCreateComments(prev => ({ ...prev, userName: user.name, userId: user._id }));
        }
    }, [user]);

    const handleClick = () => {
        if (isloggedIn) {
            setIsClicked(true)
        }
        else {
            toast.error('First you have to login to create post')
        }
    };
    const onChangeHandlerPost = (e) => {
        const { name, value } = e.target;
        setCreatePost({ ...createPost, [name]: value });
    };
    const onChangeHandlerComment = (e) => {
        if (isloggedIn) {
            const { name, value } = e.target;
            setCreateComments({ ...createComments, [name]: value });
        }
        else {
            toast.error('First you have to login to post comment')
        }

    };

    const getPostsData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getpost');
            if (response.status) {
                setPosts(response.data)
            }
            else {
                toast.error('Error while getting post')
            }

        } catch (error) {
            console.error('clintside error', error);
        }
    };
    useEffect(() => {
        getPostsData();
    }, [])


    const sendPostData = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/createPost', createPost,

                // learn about headers
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                console.log("response : ", response);
                toast.success(response.data.details ? response.data.details : response.data.message)
                setCreatePost({
                    ...createPost,
                    content: ''
                })
                getPostsData();
                setIsClicked(false)
                navigate('/');
            }
            else {
                toast.error(response.data.details ? response.data.details : response.data.message)
            }

        }
        catch (error) {
            toast.error('An error occurred while creating post.');
            console.log('An error occurred while creating post : ', error);
        }

    };
    const deletePost = async (postId) => {
        if (!admin) return;
        try {
            const response = await axios.delete(`http://localhost:5000/posts/delete/${postId}`);
            if (response.status) {
                toast.success(response.data.details ? response.data.details : response.data.message)
                getPostsData();
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
    const handleLike = async (postId) => {
        try {
            const response = await axios.post(`http://localhost:5000/likePost/${postId}`, {}, {
                headers: {
                    'Authorization': authorizationToken
                }
            });
            if (response.status === 200) {
                // Update the posts state with the new like count
                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post._id === postId ? { ...post, likes: response.data.likes } : post
                    )
                );
            } else {
                toast.error('Error liking the post');
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const getComments = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:5000/getcomment/${postId}`);
            if (response.status) {
                setComments(response.data);
            }
        } catch (error) {
            toast.error('An error occurred while fetching comments.');
            console.log('An error occurred while fetching comments : ', error);
            return [];
        }
    };

    const sendComments = async (e, postId) => {
        e.preventDefault();
        // console.log(postId);

        const commentData = {
            ...createComments,
            postId, // Ensure postId is included in the comment data
        };
        // console.log(commentData);

        try {
            const response = await axios.post('http://localhost:5000/createcomment', commentData,

                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.status) {
                toast.success(response.data.details ? response.data.details : response.data.message)
                setCreateComments({
                    ...createComments,
                    comment: '' // Reset comment field after posting
                });
                await getComments(postId);
                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post._id === postId ? { ...post, comments: [...post.comments, response.data.newComment] } : post
                    )
                );
            }
            else {
                toast.error(response.data.details ? response.data.details : response.data.message)
            }

        }
        catch (error) {
            toast.error('An error occurred while posting comment.');
            console.log('An error occurred while posting comment : ', error);
        }
    };

    const DeleteComment = async (postId, commentId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/comments/delete/${commentId}`);

            if (response.status) {
                // Safely update the comments state by checking for undefined values
                setComments(prevComments =>
                    prevComments ? prevComments.filter(comment => comment?._id !== commentId) : []
                );

                // Optionally update the posts state
                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post._id === postId
                            ? {
                                ...post,
                                comments: post.comments
                                    ? post.comments.filter(comment => comment?._id !== commentId)
                                    : []
                            }
                            : post
                    )
                );
                getPostsData()
                toast.success(response.data.details ? response.data.details : response.data.message);
            } else {
                toast.error(response.data.details ? response.data.details : response.data.message);
            }
        } catch (error) {
            toast.error('Error while deleting comment');
            console.error("Error while deleting comment:", error);
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
        <div className=" min-h-screen bg-gray-100">
            {!isClicked ? (<div className="flex items-center bg-white text-black py-4 px-6 shadow-lg max-w-md mx-auto mb-4 ">
                <div className="flex-grow">
                    <input onClick={handleClick} type="text" placeholder="What's on your mind?" className="px-4 w-full p-2 border border-gray-500 bg-gray-100 rounded-full focus:outline-none  transition duration-300" />
                </div>
                <div className="ml-4">
                    <button className="border border-gray-500 py-2 px-4 rounded-full transition duration-300 focus:outline-none">
                        Post
                    </button>
                </div>
            </div>) : (<div className="flex flex-col bg-white text-black py-4 px-6 shadow-lg max-w-md mx-auto mb-4 ">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                        {user.profileImage ? (<img
                            className="w-12 h-12 rounded-full cursor-pointer shadow-lg"
                            src={user.profileImage}
                            alt="Profile"
                        />) : (<CgProfile className="text-4xl" />)}
                        <h3 className="font-semibold text-lg cursor-pointer">{createPost.userName}</h3>

                    </div>
                    <div className="flex items-center">
                        <button onClick={() => { setIsClicked(false) }}>
                            <BiSolidShare className="text-2xl" />
                        </button>
                    </div>
                </div>
                <div className="mt-1 ">
                    <textarea
                        name="content"
                        onChange={onChangeHandlerPost}
                        value={createPost.content}
                        placeholder="What's on your mind?"
                        className="px-4 w-full p-2 bg-white rounded-lg focus:outline-none transition duration-300 resize-none"
                        rows="10"
                    ></textarea>
                    <button onClick={sendPostData} className="w-full bg-gray-100 hover:bg-gray-300 py-2 px-2 rounded-xl transition focus:outline-none">
                        Post
                    </button>
                </div>

            </div>)}

            {posts.map((post, index) => (
                <div key={index} className="bg-white text-black py-4 px-6 shadow-lg max-w-md mx-auto mb-4">
                    <div className="flex justify-between items-center pb-2 mb-4">
                        <div className="flex items-center space-x-2">
                            {post.profileImage ? (<img
                                className="w-12 h-12 rounded-full cursor-pointer shadow-lg"
                                src={post.profileImage}
                                alt="Profile"
                            />) : (<CgProfile className="text-4xl" />)}
                            <h3 className="text-lg font-semibold text-gray-700">{post.userName}</h3>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                            <p className="text-gray-500 text-sm">{formatDate(post.createdAt)}</p>
                            <div className="relative group">
                                {admin && (
                                    <button onClick={() => { deletePost(post._id) }}>
                                        <MdDeleteOutline className="text-2xl" />
                                    </button>
                                )}
                                <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 p-2 w-max bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    Delete
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4 min-h-32 post-content whitespace-pre-wrap">
                        <p className="text-gray-700">{post.content}</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-500 pt-2 text-xs">
                        <div>
                            <button className="flex items-center px-4 ">
                                {post.likes.length}  <BiLike className="ml-1" />
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
                            <button onClick={() => handleLike(post._id)} className="flex items-center px-4 ">
                                <BiLike className="ml-1" />
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
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            {comment.profileImage ? (<img
                                                className="w-8 h-8 rounded-full cursor-pointer shadow-lg"
                                                src={comment.profileImage}
                                                alt="Profile"
                                            />) : (<CgProfile className="text-4xl mr-1" />)}
                                            <h2 className="text-md font-semibold text-gray-700">{comment.userName}</h2>
                                        </div>
                                        <div>
                                            <div className="relative group">
                                                {admin && (
                                                    <button onClick={() => { DeleteComment(post._id, comment._id) }}>
                                                        <MdDeleteOutline className="text-2xl" />
                                                    </button>
                                                )}
                                                <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 p-2 w-max bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Delete
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="px-7">{comment.comment}</p>
                                    </div>
                                </div>
                            ))}
                            <div>
                                <div className="flex flex-col bg-white text-black py-4 px-6 shadow-lg max-w-md mx-auto mb-4 ">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center space-x-2">
                                            {user.profileImage ? (<img
                                                className="w-10 h-10 rounded-full cursor-pointer shadow-lg"
                                                src={user.profileImage}
                                                alt="Profile"
                                            />) : (<CgProfile className="text-4xl ml-1" />)}
                                            <h3 className="font-semibold text-lg cursor-pointer">{createComments.userName}</h3>
                                        </div>
                                        <button onClick={(e) => sendComments(e, post._id)} className=" py-2 px-4 transition hover:bg-gray-100 focus:outline-none">
                                            Post
                                        </button>
                                    </div>
                                    <div className="mt-1">
                                        <textarea
                                            name="comment"
                                            onChange={onChangeHandlerComment}
                                            value={createComments.comment}
                                            placeholder="What's on your mind?"
                                            className="px-4 w-full p-2 bg-white rounded-lg focus:outline-none transition duration-300 resize-none"
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                </div>
            ))}
        </div>
    )
}

export default AllPosts;
