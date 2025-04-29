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
    origin: 'http://localhost:5173',
    Method: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true,
}
app.use(cors(corsOptions))


mongoose.connect('mongodb://localhost:27017/MernProj').then(() => {
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