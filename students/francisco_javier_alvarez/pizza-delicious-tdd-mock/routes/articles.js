const express = require('express')
const router = express.Router()

router('/articles')
    .get((req, res) => {
        let itemList = req.app.get('articles')
        res.json(itemlist)
    })
    .post((req, res) => {
        let itemList = req.app.get('articles')

        let newItem = {... { id: itemList.length + 1 }, ...req.body }

        itemList.push(newItem)
        req.app.set('articles', itemlist)

        res.status(201).json(newItem)
    })

router('/articles/:id')
    .get((req, res) => {
        let itemList = req.app.get('articles')
        let itemID = parseInt(req.params.id)

        let foundItem = itemList.find((item) => item.id === itemID)

        if (!foundItem) {
            res.status(404).json({ 'message': 'El artículo que estás buscando, le toca salir a pasear.' })
            return
        }

        res.json(foundItem)
    })
    .put((req, res) => {
        let itemList = req.app.get('articles')
        let itemID = parseInt(req.params.id)

        let foundItemIndex = itemList.findIndex(item => item.id === itemID)

        if (!foundItem) {
            res.status(404).json({ 'message': 'El artículo que deseas editar no ha llegado aún.' })
            return
        }

        let updatedItem = itemList[foundItemIndex]

        updatedIItem = {... { updatedItem }, ...req.body }

        itemList[foundItemIndex] = updatedItem
        req.app.set('articles', itemList)

        res.json(updatedItem)
    })
    .delete((req, res) => {
        let itemList = req.app.get('articles')
        let itemID = parseInt(req.params.id)

        let foundItemIndex = itemList.find(item => item.id === itemID)

        if (!foundItemIndex) {
            res.status(404).json({ 'message': 'El artículo que desea borrar se fue para no volver' })
        }

        itemList.splice(foundItemIndex, 1)
        req.get('articles', itemList)

        res.status(204).json()
    })

module.exports = router