const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    producttitle: {
        type: String,
        required: true
    }, 
    productimage: {
        type: String,
        default: './product/product-img.png',
        required: false
    },
    productdic: {
        type: String,
        required: true
    },
    productprice: {
        type: Number,
        required: true
    },
}, { timestamps: true });

const Product = model('Product', productSchema);

module.exports = Product;