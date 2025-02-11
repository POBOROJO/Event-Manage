import express from 'express';
import connectDB from './config/db';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
dotenv.config();

const app= express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin:process.env.APP_ORIGIN,
        credentials: true, 
    })
);
app.use(cookieParser());


app.get('/health', (req, res) => {
    res.send('Hello World!');
});

app.use(errorHandler);


app.listen(4004, async() => {
    console.log(`Server is running on port ${process.env.PORT}`);
    await connectDB();
});