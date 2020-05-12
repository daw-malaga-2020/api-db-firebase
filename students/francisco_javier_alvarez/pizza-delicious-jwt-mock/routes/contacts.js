'use strict'
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const contactSchema = new Schema({
    shippingdate: { type: String, required: true, default: Date().toString() },
    name: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    email: { type: String, required: true }
})

let Contact = mongoose.model('contacts', contactSchema)

const mailer = require('../modules/mailer')
const config = require('../modules/config')

//middleware configurable para autenticación
const authMiddleware = require('../middlewares/authentication')

//middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)

router.route('/contacts')
    .get( /* methodAllowedOnlyForAdmins, */ async(req, res) => {
        try {
            let contactList = await Contact.find().exec()

            res.status(201).json(contactList)
        } catch (err) {
            console.info(err)
            res.status(500).json({ 'message': 'No se ha podido realizar la petición.' })
        }
    })
    .post(async(req, res) => {
        try {
            let newContact = await new Contact(req.body).save()
            res.status(201).send(newContact)
        } catch (err) {
            console.info(err)
            res.status(500).json({ 'message': 'o se ha podido resolver la solicitud.' })
        }
    })

router.route('/contacts/:id')
    .get( /* methodAllowedOnlyForAdmins, */ async(req, res) => {
        try {
            let searchId = req.params.id
            let foundContact = await Contact.findById(searchId)

            if (!foundContact) {
                res.status(404).json({ 'message': 'El elemento que buscas no existe.' })
                return
            }

            res.json(foundContact)
        } catch (err) {
            console.info(err)
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud.' })
        }
    })
    .delete( /* methodAllowedOnlyForAdmins, */ async(req, res) => {
        try {
            let searchId = req.params.id
            let foundContact = await Contact.findOneAndDelete({ _id: searchId })

            if (foundContact.deletedCount === 0) {
                res.status(404).json({ 'message': 'El producto que quieres borrar no está.' })
                return
            }
            res.status(204).json()
        } catch (err) {
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud.' })
        }
    })

module.exports = router