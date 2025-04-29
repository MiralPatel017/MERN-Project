const { Router } = require('express')
const Product = require('../modules/product.module')
const productRouter = Router()
const createProductServices = require('../services/product.service')
// const { generateToken } = require('../services/token.service')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/product/`))
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    }
})
const upload = multer({ storage: storage })

// create product
productRouter.post('/add-new-product', upload.single('productimage'), async (req, res) => {
    try {
        const { producttitle, productdic, productprice } = req.body

        const product = { producttitle, productdic, productprice }
        
        if (req.file) {
            product.productimage = `./product/${req.file.filename}`
        }

        const products = await createProductServices.createProduct(product);

        const newproduct = new Product(product)
        // const newProduct = { id: product._id, producttitle, productimage, productdic, productprice };

        return res.status(201).json({
            product: newproduct, message: 'Product added successfully'
        });
    }
    catch (error) {
        console.error("Adding product error : ", error);
        res.status(400).json({ message: "Error creating product: " + error.message });
    }
})

// get all products
productRouter.get('/get-all-products', async (req, res) => {
    try {
        const products = await Product.find().populate('productdic')
        return res.status(200).json(products)
    }
    catch (error) {
        console.error("Error getting all products : ", error);
        res.status(400).json({ message: "Error getting products: " + error.message });
    }
})

// get product by id
productRouter.get('/get-product/:id', async (req, res) => {
    try {
        const id = req.params.id
        const product = await Product.findById(id).populate('productdic')
        return res.status(200).json(product)
    }
    catch (error) {
        console.error("Error getting product by id : ", error);
        res.status(400).json({ message: "Error getting product: " + error.message });
    }
})

// update product
productRouter.put('/update-product/:id', upload.single('productimage'), async (req, res) => {
    try {
        const { id } = req.params;
        const { producttitle, productprice, productdic } = req.body;

        const updateData = {
            producttitle,
            productprice,
            productdic,
        };

        if (req.file) {
            updateData.productimage = `/product/${req.file.filename}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        console.log('Updating product with:', { id, producttitle, productprice, productdic });

        return res.status(200).json(updatedProduct);

    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(400).json({ message: "Error updating product: " + error.message });
    }
});


// delete product
productRouter.delete('/delete-product/:id', async (req, res) => {
    try {
        const id = req.params.id
        await Product.findByIdAndDelete(id)
        return res.status(200).json({ message: "Product deleted successfully" })
    }
    catch (error) {
        console.error("Error deleting product : ", error);
        res.status(400).json({ message: "Error deleting product: " + error.message });
    }
})


module.exports = productRouter