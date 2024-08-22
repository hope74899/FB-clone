import express from 'express'
import connect from './index.js'
import router from './Router/index.js'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const corsOptions = {
    origin: "https://fb-clone-beryl.vercel.app",
    methods: "GET, POST, PATCH, PUT, DELETE, HEAD",
    credentials: true
}


app.use(express.json());
app.use(cors(corsOptions))
app.use(router);


app.get('/', (req, res) => {
    res.send('hello world')
})

const PORT = process.env.PORT || 5000
connect()
    .then(app.listen(PORT, () => {
        console.log("app is running on port 5000")
    }))
    .catch((error) => {
        console.log('Failed to connect to MongoDB', error);
    });

