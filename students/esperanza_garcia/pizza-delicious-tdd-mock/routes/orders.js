const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/authentication')

const methodAllowedOnlyForUsers = authMiddleware(['user'], true)
const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)
const methodAllowedForUsersAndAdmins = authMiddleware(['user', 'admin'], true)

router.route('/orders')
  .get(methodAllowedForUsersAndAdmins, (req,res)=>{
    let itemList = req.app.get('orders')
    res.json(itemList)

    if(req.user.profile != 'admin'){
      itemList = itemList.filter(item => item.user.id === req.user.id )
    }
  })
  .post(methodAllowedOnlyForUsers, (req,res)=>{

    let itemList = req.app.get('orders')

    let newItem= {...{id: itemList.length + 1},...req.body}

    newItem.user.id = req.user.id

    itemList.push(newItem)
    req.app.set('orders', itemList)

    res.status(201).json(newItem)
  })

router.route('/orders/:id')
  .get(methodAllowedForUsersAndAdmins, (req,res)=>{
    let itemList= req.app.get('orders')
    let searchId= parseInt(req.params.id)

    let foundItem= itemList.find(item=> item.id===searchId)

    if(req.user.profile !== 'admin'){
      foundItem = itemList.find(item => item.id === searchId && item.user.id === req.user.id)

    }
    if(!foundItem){
      res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
      return
    }
    res.json(foundItem)
  })
  .put(methodAllowedOnlyForAdmins,(req, res) => {

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

module.exports = router
