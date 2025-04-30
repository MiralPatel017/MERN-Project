const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user.route');
const productRouter = require('./routes/product.route');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// CORS configuration
const corsOptions = {
    origin: '*', // Allow all origins (change this in production)
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'], // Allow all HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    preflightContinue: false, // Pass the CORS preflight response to the next handler
    optionsSuccessStatus: 204 // Some legacy browsers choke on 204
};

// Use CORS middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve('./public')));

// MongoDB connection
mongoose.connect('mongodb+srv://miralizion2024:1ps9p1B9FWhdwosz@cluster0.hy3okm1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Port setup
const PORT = process.env.PORT || 5713;

// User route
app.use('/user', userRouter);
// Product route
app.use('/product', productRouter);

// Server run
app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});