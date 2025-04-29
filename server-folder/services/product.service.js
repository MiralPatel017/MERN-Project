const Product = require('../modules/product.module')
// const User = require('../modules/user.module')

const multer = require('multer')

// store in local storage
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


async function createProduct(productData) {

    const { producttitle, productimage, productdic, productprice } = productData

    if (!productdic || !producttitle || !productprice) { throw new Error('All is required') }


    const product = new Product({
        producttitle,
        productimage,
        productdic,
        productprice
    })
    return product.save()
}

module.exports = { createProduct }