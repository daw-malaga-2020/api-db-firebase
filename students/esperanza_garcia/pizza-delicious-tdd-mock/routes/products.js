const express= require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authentication')

const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)

router.route('/products')
  .get((req,res) => {
    let itemList = req.app.get('products')
    res.json(itemList)
  })
  .post(methodAllowedOnlyForAdmins,(req,res) => {

    let itemList = req.app.get('products')

    let newItem = { ...{ id: itemList.length + 1 }, ...req.body}

    itemList.push(newItem)
    req.app.set('products', itemList)

    res.status(201).json(newItem)
  })

  router.route('/products/:id')
    .get((req,res) => {

      let itemList = req.app.get('products')
      let searchId= parseInt(req.params.id)

      let foundItem= itemList.find(item => item.id === searchId)

      if (!foundItem){
        res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
        return
      }

      res.json(foundItem)
    })
    .put(methodAllowedOnlyForAdmins,(req,res) => {

      let itemList= req.app.get('products')
      let searchId = parseInt(req.params.id)

      let foundItemIndex = itemList.findIndex(item => item.id === searchId)

      if(foundItemIndex === -1){
        res.status(404).json({'message' : 'El elemento que intentas editar no existe'})
        return
      }

      let updateItem = itemList[foundItemIndex]

      updateItem= {...updateItem, ...req.body}

      itemList[foundItemIndex] = updateItem

      req.app.set('products', itemList)

      res.json(updateItem)
    })
    .delete(methodAllowedOnlyForAdmins,(req,res) => {

      let itemList = req.app.get('products')
      let searchId = parseInt(req.params.id)

      let foundItemIndex = itemList.findIndex(item => item.id === searchId)

      if(foundItemIndex === -1){
        res.status(404).json({'message': 'El elemento que intentas eliminar no existe'})
        return
      }
      itemList.splice(foundItemIndex, 1)
      req.app.get('products', itemList)

      res.status(204).json()
    })

module.exports = router
