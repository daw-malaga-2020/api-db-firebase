const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let productSchema = new Schema({
    title: { type: String, required: false },
    category: { type: String, required: false },
    image: { type: String, required: false },
    description: { type: String, required: false },
    price: { type: Number, required: false, min: 0.1 },
    enabled: { type: Boolean, default: false }
});
let Product = mongoose.model('products', productSchema)

//middleware configurable para autenticación
const authMiddleware = require('../middlewares/authentication')

//middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)

router.route('/products')
    .get(async(req, res) => {
        //REQUEST >> bearerToken >> express.json >> propio middleware de la ruta >> RESPONSE
        productList = await Product.find().exec()

        res.json(productList)
    })
    .post( /* methodAllowedOnlyForAdmins ,*/ async(req, res) => {
        let newProduct = await new Product(req.body).save()
        res.status(201).send(newProduct)
    })

router.route('/products/:id')
    .get(async(req, res) => {
        try {
            let searchId = req.params.id
            let foundProduct = await Product.findById(searchId)

            if (!foundProduct) {
                res.status(404).json({ 'message': 'El elemento que buscas no existe.' })
                return
            }

            res.json(foundProduct)
        } catch (err) {
            console.info(err)
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud.' })
        }

    })
    .put( /* methodAllowedOnlyForAdmins, */ async(req, res) => {
        try {
            let searchId = req.params.id
            let foundProduct = await Product.findOneAndUpdate(searchId, req.body, { new: true })
            res.json(foundProduct)
        } catch (err) {
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud.' })
        }
    })
    .delete( /* methodAllowedOnlyForAdmins, */ async(req, res) => {
        try {
            let searchId = req.params.id
            let foundProduct = await Product.findOneAndDelete({ _id: searchId })

            if (foundProduct.deletedCount === 0) {
                res.status(404).json({ 'message': 'El producto que quieres borrar no está.' })
                return
            }
            res.status(204).json()
        } catch (err) {
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud.' })
        }
    })

module.exports = router