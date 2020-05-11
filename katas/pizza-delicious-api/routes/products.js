const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Schema = mongoose.Schema
//middleware configurable para autenticación
const authMiddleware = require('../middlewares/authentication')

//middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)

const ProductsSchema = new Schema({
  title: {type: String, required: true},
  category: {type: String, required: true},
  image: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Number, required: true, min: 0.1},
  enabled: {type: Boolean, default: false}
})

const Product = new mongoose.model('products', ProductsSchema)

router.route('/products')
  .get(async (req, res) => {
    //REQUEST >> bearerToken >> express.json >> propio middleware de la ruta >> RESPONSE
    let itemList = await Product.find().exec()


    res.json(itemList)
  })
  .post(methodAllowedOnlyForAdmins, async (req, res) => {
    //REQUEST >> bearerToken >> express.json >> methodAllowedOnlyForAdmins >> propio middleware de la ruta >> RESPONSE

    let newProduct = await new Product(req.body).save()

    res.status(201).json(newProduct)
  })

router.route('/products/:id')
  .get((req, res) => {
    //REQUEST >> bearerToken >> express.json >> propio middleware de la ruta >> RESPONSE
    let itemList = req.app.get('products')
    let searchId = parseInt(req.params.id)

    let foundItem = itemList.find(item => item.id === searchId)

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
      return
    }

    res.json(foundItem)
  })
  .put(methodAllowedOnlyForAdmins, (req, res) => {
    //REQUEST >> bearerToken >> express.json >> methodAllowedOnlyForAdmins >> propio middleware de la ruta >> RESPONSE
    let itemList = req.app.get('products')
    let searchId = parseInt(req.params.id)

    let foundItemIndex = itemList.findIndex(item => item.id === searchId)

    if (foundItemIndex === -1) {
      res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
      return
    }

    let updatedItem = itemList[foundItemIndex]

    updatedItem = { ...updatedItem, ...req.body }

    itemList[foundItemIndex] = updatedItem
    req.app.set('products', itemList)

    res.json(updatedItem)
  })
  .delete(methodAllowedOnlyForAdmins, (req, res) => {
    //REQUEST >> bearerToken >> express.json >> methodAllowedOnlyForAdmins >> propio middleware de la ruta >> RESPONSE
    let itemList = req.app.get('products')
    let searchId = parseInt(req.params.id)

    let foundItemIndex = itemList.findIndex(item => item.id === searchId)

    if (foundItemIndex === -1) {
      res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
      return
    }

    itemList.splice(foundItemIndex, 1)
    req.app.set('products', itemList)

    res.status(204).json()
  })

module.exports = router
