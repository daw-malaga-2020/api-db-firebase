const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ordersSchema = new Schema({
    products: [{ type: String, required: true }],
    total: { type: Number, required: true },
    user: { type: Object, required: true },
    state: { type: Number, required: true },
    date: { type: String, required: true },
    shippingdate: { type: String, required: true, default: Date().toString() }
})

const Order = new mongoose.model('orders', ordersSchema)

//middleware configurable para autenticación
const authMiddleware = require('../middlewares/authentication')

//middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForUsers = authMiddleware(['user'], true)
    //middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)
    //middleware configurable para usar el método usuarios y administradores
const methodAllowedForUsersAndAdmins = authMiddleware(['user', 'admin'], true)

router.route('/orders')
    .get( /* methodAllowedForUsersAndAdmins, */ async(req, res) => {
        try {
            let ordersList = await User.find().exec()
            res.status(201).json(ordersList)
        } catch (err) {
            console.info(err)
            res.status(500).json({ 'message': 'No se ha podido resolver la petición.' })
        }
    })
    .post( /* methodAllowedOnlyForUsers, */ async(req, res) => {
        try {
            let newOrders = await new Order(req.body).save()
            res.status(201).send(newOrders)
        } catch (err) {
            console.info(err)
            res.status(500).json({ 'message': 'no se ha podido resolver la solicitud.' })
        }
    })

router.route('/orders/:id')
    .get( /* methodAllowedForUsersAndAdmins, */ async(req, res) => {
        try {
            let searchId = req.params.id
            let foundOrder = await Order.findById(searchId)

            if (!foundOrder) {
                res.status(404).json({ 'message': 'El elemento que buscas no existe.' })
                return
            }

            res.json(foundOrder)
        } catch (err) {
            console.info(err)
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud.' })
        }
    })
    .put( /* methodAllowedOnlyForAdmins,  */ async(req, res) => {
        try {
            let searchId = req.params.id
            let foundOrder = await Order.findOneAndUpdate(searchId, req.body, { new: true })
            res.json(foundOrder)
        } catch (err) {
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud.' })
        }
    })

router.route('/orders/:id/status')
    .put( /* methodAllowedOnlyForAdmins, */ async(req, res) => {
        try {
            let searchId = req.params.id
            let foundOrder = await Order.findOneAndDelete({ _id: searchId })

            if (foundOrder.deletedCount === 0) {
                res.status(404).json({ 'message': 'El producto que quieres borrar no está.' })
                return
            }
            res.status(204).json()
        } catch (err) {
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud.' })
        }
    })

module.exports = router