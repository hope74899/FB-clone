import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Store/AuthToken';
import { toast } from 'react-toastify';
import { baseurl } from '../BaseURL';

function Messages() {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const userId = user._id;
    if (userId) {
      fetchFriends(userId);
    }
  }, [user]);

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

  const fetchMessages = async (friendId) => {
    const userId = user._id;
    try {
      const response = await axios.get(`${baseurl}/messages/${userId}/${friendId}`);
      if (response.status === 200) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("An error occurred while fetching messages.");
    }
  };

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
    fetchMessages(friend._id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const messageData = {
      senderId: user._id,
      receiverId: selectedFriend._id,
      content: newMessage
    };

    try {
      const response = await axios.post(`${baseurl}/send-message`, messageData);
      if (response.status === 201) {
        // Append new message to the current messages array
        setMessages([...messages, response.data]);
        setNewMessage('');
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("An error occurred while sending the message.");
    }
  };

  // Function to handle pressing the Enter key to send the message
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Friends List on Left */}
      <div className="w-1/4 bg-white p-4 shadow-lg overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Friends</h2>
        <ul className="space-y-4">
          {friends.map((friend) => (
            <li key={friend._id}>
              <button
                onClick={() => handleFriendClick(friend)}
                className={`w-full text-left p-3 rounded-lg hover:bg-gray-200 ${selectedFriend && selectedFriend._id === friend._id ? 'bg-gray-300 font-bold' : ''}`}
              >
                <div className="flex items-center">
                  <img
                    src={friend.profileImage || '/image.jpg'}
                    alt={friend.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span>{friend.name}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window on Right */}
      <div className="w-3/4 flex flex-col p-6 bg-white shadow-lg">
        {selectedFriend ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{selectedFriend.name}</h2>
            <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.senderId === user._id ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block px-4 py-2 rounded-lg ${msg.senderId === user._id ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}  // Add Enter key event listener
                placeholder="Type a message..."
                className="w-full p-2 border rounded-l-lg"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 rounded-r-lg"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Select a friend to start messaging.</p>
        )}
      </div>
    </div>
  );
}

export default Messages;
