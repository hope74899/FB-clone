import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connection = async () => {
    try {
        const connect = await mongoose.connect(process.env.URL)
        if (connect) {
            console.log('connection succesfull')
        }
    } catch (error) {
        console.log('error while connecting')
    }
};

export default connection;