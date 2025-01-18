import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Store/AuthToken';
import { toast } from 'react-toastify';
import { baseurl } from '../BaseURL';

function Friends() {
  const [activeTab, setActiveTab] = useState('friends'); // default tab
  const [friends, setFriends] = useState([]);
  const [friendRequestsReceived, setFriendRequestsReceived] = useState([]);
  const [friendRequestsSent, setFriendRequestsSent] = useState([]);
  const [loading, setLoading] = useState(false);
  const {user} = useAuth();
  

  // Fetch friends list
  const fetchFriends = async (userId) => {
    setLoading(true);    
    try {
      const response = await axios.get(`${baseurl}/${userId}/friends`);
      if (response.status === 200) {
        setFriends(response.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      toast.error("An error occurred while fetching friends.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch friend requests (both received and sent)
  const fetchFriendRequests = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseurl}/${userId}/friend-requests`);
      if (response.status === 200) {
        setFriendRequestsReceived(response.data.received);
        setFriendRequestsSent(response.data.sent);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      toast.error("An error occurred while fetching friend requests.");
    } finally {
      setLoading(false);
    }
  };

  // Use `useEffect` to call `fetchFriends` and `fetchFriendRequests` when component mounts
  useEffect(() => {
    const userId = user._id;
    if (userId) {
      fetchFriends(userId);
      fetchFriendRequests(userId);
    }
  }, [user]);

  const acceptFriendRequest = async (requesterId) => {
    const userId = user._id;
    try {
      const response = await axios.post(`${baseurl}/${userId}/accept-friend-request/${requesterId}`);
      if (response.status === 200) {
        toast.success("Friend request accepted successfully!");
        fetchFriendRequests(userId)
        // Optionally, update your friend requests and friends list here
      } else {
        toast.error(response.data.message || "Failed to accept friend request.");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("An error occurred while accepting the friend request.");
    }
  };
  
  // Function to decline a friend request
  const declineFriendRequest = async (requesterId) => {
    try {
      const userId = user._id;
      if(!userId)return;
      const response = await axios.delete(`${baseurl}/${userId}/decline-friend-request/${requesterId}`);
      if (response.status === 200) {
        toast.success("Friend request declined successfully!");
        // Optionally, update your friend requests list here
        fetchFriendRequests(userId)
      } else {
        toast.error(response.data.message || "Failed to decline friend request.");
      }
    } catch (error) {
      console.error("Error declining friend request:", error);
      toast.error("An error occurred while declining the friend request.");
    }
  };

  const [users, setUsers] = useState([]);

    const allusers = async (userId) => {
      // console.log(userId);
      setLoading(true); 
        try {
            const response = await axios.get(`${baseurl}/allusers/${userId}`);
            if (response.status === 200) {
                setUsers(response.data);
            }
        } catch (error) {
            console.log(error);
        }
        finally {
          setLoading(false);
        }
      } 

    useEffect(() => {
      const userId = user._id;
      if(userId)allusers(userId)
    }, []);

    const [searchQuery, setSearchQuery] = useState('');

    // Filter users based on the search query
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
const handleMessage=() => {
  
}
const handleUnfriend=() => {
  
}
const handleSendFriendRequest = async (targetedUserId) => {
  const userId = user._id;
  try {
    const response = await axios.post(`${baseurl}/${userId}/friend-request/${targetedUserId}`);

    if (response.status === 200) {
      toast.success('Friend request sent successfully!');
    } else {
      toast.error('Failed to send friend request.');
    }
  } catch (error) {
    toast.error('An error occurred while sending the friend request.');
    console.error('Error in sending friend request:', error);
  }
};


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4 shadow-lg">
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => handleTabClick('friends')}
              className={`w-full text-left p-3 rounded-lg hover:bg-gray-200 ${activeTab === 'friends' ? 'bg-gray-300 font-bold' : ''}`}
            >
              Friends
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabClick('addFriend')}
              className={`w-full text-left p-3 rounded-lg hover:bg-gray-200 ${activeTab === 'addFriend' ? 'bg-gray-300 font-bold' : ''}`}
            >
              Add Friend
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabClick('friendRequests')}
              className={`w-full text-left p-3 rounded-lg hover:bg-gray-200 ${activeTab === 'friendRequests' ? 'bg-gray-300 font-bold' : ''}`}
            >
              Friend Requests
            </button>
          </li>
        </ul>
      </div>

      {/* Right Content */}
      <div className="w-3/4 p-6">
        {/* Friends Tab */}
        {activeTab === 'friends' && (
          loading ? (
            <p>Loading friends...</p>
          ) : friends.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend, index) => (
                <div key={index} className="bg-white p-4 shadow-md rounded-lg">
                  <img
                    src={friend.profileImage
                      ||'/image.jpg'}
                    alt="Friend"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <div>
                    <div>
                    <h3 className="ml-2 mt-2 font-bold text-lg">{friend.name}</h3>
                    </div>
                    <div className="flex mt-4 justify-between">
                        <button onClick={handleMessage} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Message</button>
                        <button onClick={handleUnfriend} className="bg-gray-300 px-4 py-2 rounded-lg">Remove Friend</button>
                      </div>
                  </div>
                 
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h2>No friends found</h2>
            </div>
          )
        )}

        {/* Add Friend Tab */}
        {activeTab === 'addFriend' && (
        loading ? (
          <p>Loading Users...</p>
        ) : filteredUsers.length > 0 ? (
          <>
          <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user, index) => (
              <div key={index} className="bg-white p-4 shadow-md rounded-lg">
                <img
                  src={user.profileImage
                    ||'/image.jpg'}
                  alt="Friend"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className='flex justify-between items-center'>
                  <div>
                  <h3 className="mt-2 font-bold text-lg">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.bio}</p>
                  </div>
                  <div>
                  <button onClick={()=>handleSendFriendRequest(user._id)} className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2">Add Friend</button>
                  </div>
                
                </div>
              </div>
            ))}
          </div>
          </>
        ) : (
          <div>
            <h2>No user found</h2>
          </div>
        )
      )}

        {/* Friend Requests Tab */}
        {activeTab === 'friendRequests' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>
            {loading ? (
              <p>Loading friend requests...</p>
            ) : (
              <div>
                {/* Received Friend Requests */}
                <h3 className="text-lg font-semibold mb-2">Received Requests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {friendRequestsReceived.length > 0 ? friendRequestsReceived.map((request, index) => (
                    <div key={index} className="bg-white p-4 shadow-md rounded-lg">
                      <img
                        src={request.profileImage || '/image.jpg'}
                        alt="Requester"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <h3 className="mt-2 font-bold text-lg">{request.name}</h3>
                      <p className="text-sm text-gray-600">{request.bio}</p>
                      <div className="flex justify-between mt-4">
                        <button onClick={()=>acceptFriendRequest(request._id)} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Confirm</button>
                        <button onClick={()=>declineFriendRequest(request._id)} className="bg-gray-300 px-4 py-2 rounded-lg">Delete</button>
                      </div>
                    </div>
                  )) : (
                    <p>No received friend requests.</p>
                  )}
                </div>

                {/* Sent Friend Requests */}
                <h3 className="text-lg font-semibold mb-2 mt-6">Sent Requests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {friendRequestsSent.length > 0 ? friendRequestsSent.map((request, index) => (
                    <div key={index} className="bg-white p-4 shadow-md rounded-lg">
                      <img
                       src={request.profileImage ||'/image.jpg'}
                        alt="Friend Request Sent"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <h3 className="mt-2 font-bold text-lg">{request.name}</h3>
                      <p className="text-sm text-gray-600">{request.bio}</p>
                      <p className="text-sm text-gray-600 mt-2">Request sent</p>
                    </div>
                  )) : (
                    <p>No sent friend requests.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Friends;
