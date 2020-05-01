const express = require('express')
const router = express.Router()

router.route('/orders')
  .get((req, res) => {
    let itemList = req.app.get('orders')
    res.json(itemList)
  })
  .post((req, res) => {

    let itemList = req.app.get('orders')

    let newItem = { ...{ id: itemList.length + 1 }, ...req.body }

    itemList.push(newItem)
    req.app.set('orders', itemList)


    res.status(201).json(newItem)
  })

router.route('/orders/:id')
  .get((req, res) => {

    let itemList = req.app.get('orders')
    let searchId = parseInt(req.params.id)

    let foundItem = itemList.find(item => item.id === searchId)

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
      return
    }

    res.json(foundItem)
  })
  .put((req, res) => {

    let itemList = req.app.get('orders')
    let searchId = parseInt(req.params.id)

    let foundItemIndex = itemList.findIndex(item => item.id === searchId)

    if (foundItemIndex === -1) {
      res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
      return
    }

    let updatedItem = itemList[foundItemIndex]

    updatedItem = { ...updatedItem, ...req.body }

    itemList[foundItemIndex] = updatedItem
    req.app.set('orders', itemList)

    res.json(updatedItem)
  })

router.route('/orders/:id/status')
  .put((req, res) => {

    let itemList = req.app.get('orders')
    let searchId = parseInt(req.params.id)

    let foundItemIndex = itemList.findIndex(item => item.id === searchId)

    if (foundItemIndex === -1) {
      res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
      return
    }

    let updatedItem = itemList[foundItemIndex]

    updatedItem.status = req.body.status

    itemList[foundItemIndex] = updatedItem
    req.app.set('orders', itemList)

    res.json({status: updatedItem.status})
  })

module.exports = router
