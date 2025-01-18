// models/Message.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const messageSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export default model('Message', messageSchema);
