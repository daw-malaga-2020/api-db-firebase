const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    profile: { type: String, required: true },
    enabled: { type: Boolean, required: true }
})
let User = mongoose.model('users', userSchema)

const md5 = require('md5')
    //middleware configurable para autenticación
const authMiddleware = require('../middlewares/authentication')

//middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)
    //middleware configurable para usar el método usuarios y administradores
const methodAllowedForUsersAndAdmins = authMiddleware(['user', 'admin'], true)

router.route('/users')
    .get( /* methodAllowedOnlyForAdmins, */ async(req, res) => {
        try {
            usersList = await User.find().exec()

            res.status(201).json(usersList)
        } catch (err) {
            console.info(err)
            res.status(500).json({ 'message': 'No se ha podido realizar la petición.' })
        }
    })
    .post(async(req, res) => {
        try {
            let user = req.body
            user.password = md5(user.password)
            let newUser = await new User(user).save()
            res.status(201).send(newUser)
        } catch (err) {
            console.info(err)
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud.' })
        }
    })

router.route('/users/:id')
    .get( /* methodAllowedForUsersAndAdmins, */ async(req, res) => {
        try {
            let searchId = req.params.id
            let foundUser = await User.findById(searchId)

            if (!foundUser) {
                res.status(404).json({ 'message': 'El usuario que buscas no existe.' })
                return
            }

            foundUser.password = "contraseña encriptada"

            res.json(foundUser)
        } catch (err) {
            console.info(err)
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud.' })
        }
    })
    .put( /* methodAllowedForUsersAndAdmins, */ async(req, res) => {
        try {
            let searchId = req.params.id
            let foundUser = await User.findOneAndUpdate(searchId, req.body, { new: true })
            res.json(foundUser)
        } catch (err) {
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud.' })
        }
    })
    .delete( /* methodAllowedForUsersAndAdmins, */ async(req, res) => {
        try {
            let searchId = req.params.id
            let foundUser = await User.findOneAndDelete({ _id: searchId })

            if (foundUser.deletedCount === 0) {
                res.status(404).json({ 'message': 'El usuario que quieres borrar no está.' })
                return
            }
            res.status(204).json()
        } catch (err) {
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud.' })
        }
    })

module.exports = router