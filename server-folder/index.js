const path = require('path');

const express = require('express');

const mongoose = require('mongoose');
// user
const userRouter = require('./routes/user.route');
// product
const productRouter = require('./routes/product.route');
const cookieParser = require('cookie-parser');


const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cookieParser());
// app.use(express.json());

app.use(bodyParser.json())

const corsOptions = {
    origin: '*', // Allow all origins
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'], // Allow all HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    preflightContinue: false, // Pass the CORS preflight response to the next handler
    optionsSuccessStatus: 204 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions))


mongoose.connect('mongodb+srv://miralizion2024:1ps9p1B9FWhdwosz@cluster0.hy3okm1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => {
    console.log('Connected to MongoDB');
})

// enode when submit the data on form
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve('./public')))


// port setup
const PORT = process.env.PORT || 5713;

// user route
app.use('/user', userRouter);
// product route
app.use('/product', productRouter);

// server run
app.listen(PORT, () => {
    console.log(`server is running on port: http://localhost:${PORT}`);
})
