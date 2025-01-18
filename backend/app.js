import express from 'express'
import connect from './index.js'
import router from './Router/index.js'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();
const app = express();
// const corsOptions = {
//     origin: "http://localhost:5173",
//     methods: "GET, POST, PATCH, PUT, DELETE, HEAD",
//     credentials: true
// }


app.use(express.json());
app.use(cors())
app.use(router);


app.get('/', (req, res) => {
    res.send('hello world')
})

const PORT = process.env.PORT || 5000
connect()
    .then(app.listen(PORT, '0.0.0.0', () => {
        console.log("app is running on 192.168.100.180 at port 5000")
    }))
    .catch((error) => {
        console.log('Failed to connect to MongoDB', error);
    });

