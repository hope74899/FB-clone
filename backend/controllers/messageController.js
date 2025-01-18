// controllers/messageController.js
import Message from '../models/messages.js';

// Function to send a new message
export const sendMessage = async (req, res) => {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
        console.log('Missing required fields');
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newMessage = new Message({ senderId, receiverId, content });
        await newMessage.save();

        console.log('Message successfully saved:', newMessage);
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
};


// Function to get all messages between two users
export const getMessages = async (req, res) => {
    const { userId, friendId } = req.params;

    try {
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: friendId },
                { senderId: friendId, receiverId: userId }
            ]
        }).sort({ timestamp: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ message: 'Failed to retrieve messages' });
    }
};
