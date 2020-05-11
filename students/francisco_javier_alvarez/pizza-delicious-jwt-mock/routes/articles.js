const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let articleSchema = new Schema({
    image: { type: String, required: false },
    title: { type: String, required: false },
    publicationdate: { type: String, required: true, default: Date().toString() },
    body: { type: String, required: true },
    resume: { type: String, required: true },
    labels: { type: String, required: true },
    autor: { type: String, required: true },
    category: [{ title: String }],
    enabled: { type: Boolean, default: false }
})

let Article = mongoose.model('articles', articleSchema)

//middleware configurable para autenticación
const authMiddleware = require('../middlewares/authentication')

//middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)

router.route('/articles')
    .get(async(req, res) => {
        try {
            articlesList = await Article.find().exec()

            res.status(201).json(articlesList)
        } catch (err) {
            console.info(err)
            res.status(500).json({ 'message': 'No hay ningún producto para mostrar.' })
        }
    })
    .post( /* methodAllowedOnlyForAdmins, */ async(req, res) => {
        try {
            let newArticle = await new Article(req.body).save()
            res.status(201).send(newArticle)
        } catch (err) {
            console.info(err)
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud.' })
        }
    })

router.route('/articles/:id')
    .get(async(req, res) => {
        try {
            let searchId = req.params.id
            let foundArticle = await Article.findById(searchId)

            if (!foundArticle) {
                res.status(404).json({ 'message': 'El elemento que buscas no existe.' })
                return
            }

            res.json(foundArticle)
        } catch (err) {
            console.info(err)
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud.' })
        }
    })
    .put( /* methodAllowedOnlyForAdmins, */ async(req, res) => {
        try {
            let searchId = req.params.id
            let foundArticle = await Article.findOneAndUpdate(searchId, req.body, { new: true })
            res.json(foundArticle)
        } catch (err) {
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud.' })
        }
    })
    .delete( /* methodAllowedOnlyForAdmins, */ async(req, res) => {
        try {
            let searchId = req.params.id
            let foundArticle = await Article.findOneAndDelete({ _id: searchId })

            if (foundArticle.deletedCount === 0) {
                res.status(404).json({ 'message': 'El producto que quieres borrar no está.' })
                return
            }
            res.status(204).json()
        } catch (err) {
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud.' })
        }
    })

module.exports = router