const express = require('express')

const mailer = require('../modules/mailer')
const config = require('../modules/config')

const router = express.Router()

router.route('/contacts')
  .get((req, res) => {
    let itemList = req.app.get('contacts')
    res.json(itemList)
  })
  .post((req, res) => {

    let itemList = req.app.get('contacts')

    let newItem = { ...{ id: itemList.length + 1 }, ...req.body }

    itemList.push(newItem)
    req.app.set('contacts', itemList)

    mailer.send(config.ADMIN_EMAIL,config.CONTACT_SUBJECT,config.CONTACT_BODY, false)


    res.status(201).json(newItem)
  })

router.route('/contacts/:id')
  .get((req, res) => {

    let itemList = req.app.get('contacts')
    let searchId = parseInt(req.params.id)

    let foundItem = itemList.find(item => item.id === searchId)

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
      return
    }

    res.json(foundItem)
  })
  .delete((req, res) => {

    let itemList = req.app.get('contacts')
    let searchId = parseInt(req.params.id)

    let foundItemIndex = itemList.findIndex(item => item.id === searchId)

    if (foundItemIndex === -1) {
      res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
      return
    }

    itemList.splice(foundItemIndex, 1)
    req.app.get('contacts', itemList)

    res.status(204).json()
  })

module.exports = router
