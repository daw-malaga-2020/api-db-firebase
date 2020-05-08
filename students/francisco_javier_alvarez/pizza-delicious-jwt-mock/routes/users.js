const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
    email: { type: String, required: false },
    password: { type: String, required: false },
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    profile: { type: String, required: false },
    enabled: { type: Boolean, default: false }
});
let User = mongoose.model('users', userSchema)
const md5 = require('md5')

/*     //middleware configurable para autenticación
const authMiddleware = require('../middlewares/authentication')

//middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)
    //middleware configurable para usar el método usuarios y administradores
const methodAllowedForUsersAndAdmins = authMiddleware(['user', 'admin'], true) */

router.route('/users')
    .get( /* methodAllowedOnlyForAdmins ,*/ async(req, res) => {
        try {
            let usersList = await User.find().exec()
            usersList.map((user) => user.password = "")
            res.status(201).json(usersList)
        } catch (err) {
            console.info(err)
            res.status(500).json({ 'message': 'No se ha podido resolver la petición.' })
        }
    })
    .post(async(req, res) => {
        try {
            let user = req.body
            user.password = md5(user.password)

            let newUser = await new User(user).save()
            res.status(201).json(newUser)
        } catch (err) {
            res.status(500).json({ 'message': 'No se ha podido resolver la petición.' })
        }
    })

router.route('/users/:id')
    .get( /* methodAllowedForUsersAndAdmins ,*/ async(req, res) => {
        try {
            let searchId = req.params.id
            let foundUser = await User.findById(searchId)

            if (!foundUser) {
                res.status(404).json({ 'message': 'El usuario que buscas no existe.' })
                return
            }
            foundUser.password = "*"

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