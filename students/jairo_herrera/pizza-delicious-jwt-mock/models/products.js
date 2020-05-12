
const mongoose = require ('mongoose')

const ProductSchema = require('./schemas/products')

const ProductModel = new mongoose.model('products, productsSchema')
module.exports = ProductModel